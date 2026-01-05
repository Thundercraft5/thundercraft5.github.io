import fs from "fs/promises";
import path from "path";
import chokidar from "chokidar"
import nextJSConfig from "../next.config.ts"
import parseCommandLine, {command, subcommands, run, string, positional, restPositionals} from "cmd-ts"
import frontmatter from "gray-matter";
import "colors";

const generate = command({
    "name": "generate",
    args: {},
    async "handler"() {
        await writeManifest();
    }
})

const watch = command({
    "name": "generate",
    args: {
        directory: restPositionals({
            type: string,
        })
    },
    async "handler"({ directory }) {
        logMessage("Watching directories: ", ...directory)
        chokidar.watch(directory, {
            persistent: true,
        }).on("add", async path => {
            await writeManifest()
            logMessage("File added: ", path)
        }).on("unlink", async path => {
            await writeManifest()
            logMessage("File removed: ", path)
        }).on("addDir", async path => {
            await writeManifest()
            logMessage("Directory added: ", path)
        }).on("unlinkDir", async path => {
            await writeManifest()
            logMessage("Directory removed: ", path)
        })
    }
})


const app = subcommands({
    "name": process.argv[1]!,
    cmds: { generate, watch }
})

async function writeManifest() {
  const routeMap = await generateRouteMap();
  await fs.writeFile(path.relative(process.cwd(), "./public/routes-manifest.json"), JSON.stringify(routeMap, null, 2))
  await generateSitemaps(routeMap);
}

async function generateSitemaps(routeMap: Record<string, any>) {
  const SITE_URL = process.env.SITE_URL ?? 'https://thundercraft5.github.io';

  const urls: Array<{ loc: string; lastmod?: string; description?: string }> = [];

  for (const [route, { path: displayPath, frontmatter }] of Object.entries(routeMap)) {
    // Skip dynamic or explicitly excluded routes
    if (route.includes('[')) continue;
    if (frontmatter?.sitemap === false) continue;
    if (frontmatter?.noindex) continue;
    if (frontmatter?.ignoreSegment) continue;

    // Determine lastmod: frontmatter.date or file mtime
    let lastmod: string | undefined;
    if (frontmatter?.date) {
      try { lastmod = new Date(frontmatter.date).toISOString().split('T')[0]; } catch { /* ignore */ }
    }
    if (!lastmod) {
      try {
        const stat = await fs.stat(path.join(process.cwd(), displayPath));
        lastmod = stat.mtime.toISOString().split('T')[0];
      } catch { /* ignore */ }
    }

        urls.push({ loc: SITE_URL.replace(/\/$/, '') + route, lastmod, description: frontmatter?.description, changefreq: frontmatter?.changefreq });
  }

  // Build sitemap-0.xml (one file for now)
  const urlsetHeader = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

  function escapeXml(s: string) {

    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  const urlEntries = urls.map(u => {
    const lastmod = u.lastmod ? `\n  <lastmod>${u.lastmod}</lastmod>` : '';
    const changefreq = `\n  <changefreq>${escapeXml(String((u as any).changefreq ?? 'daily'))}</changefreq>`;
    return `  <url>\n    <loc>${u.loc}</loc>${lastmod}${changefreq}\n  </url>`;
  }).join('\n');

  const urlsetFooter = `\n</urlset>`;

  const sitemapContent = urlsetHeader + urlEntries + urlsetFooter;

  await fs.writeFile(path.relative(process.cwd(), './public/sitemap-0.xml'), sitemapContent, { encoding: 'utf-8' });

  // Write sitemap index
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>${SITE_URL.replace(/\/$/, '')}/sitemap-0.xml</loc></sitemap>\n</sitemapindex>`;

  await fs.writeFile(path.relative(process.cwd(), './public/sitemap.xml'), sitemapIndex, { encoding: 'utf-8' });
  logMessage('Wrote sitemap.xml and sitemap-0.xml');
}

async function asyncForeach<T extends unknown[]>(array: T, callback: (value: T[number], index: number, arr: T) => Promise<any>): Promise<T> {
    await Promise.all(array.map((value, i) => callback(value, i, array)))


    return array;
}

// CONFIG: Check if you use 'src/pages' or just 'pages'
const PAGES_DIR = await fs.access(path.join(process.cwd(), 'src/pages')).then(()=>true,()=>false)
  ? path.join(process.cwd(), 'src/pages') 
  : path.join(process.cwd(), 'pages');

const IGNORE_FILES = ['_app', '_document', '_error', 'api'];
const PAGE_EXTENSIONS = nextJSConfig.pageExtensions?.map(v => `.${v}`) ?? []

async function getFileList(dir: Dir) {
  let results = [];
  const list = await fs.readdir(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively scan directories
      results = results.concat(await getFileList(filePath));
    } else {
      results.push(filePath);
    }
  };
  return results;
}

async function generateRouteMap() {
  const files = await getFileList(PAGES_DIR);
    const routeMap = {};
    
  

for (const fullPath of files) {
    // 1. Get relative path from pages dir (e.g., 'blog/index.tsx')
  const {displayPath, route} = resolvePath(fullPath) ?? {}
  if (!displayPath || !route) continue;
  const frontmatter = await getFrontMatter(displayPath);
  const split = route.split("/");
    routeMap[route] = { path: displayPath, frontmatter, breadcrumbs: [] };
  };

  for (const [route, { path, frontmatter }] of Object.entries(routeMap)) {
    const split = route.split("/");
    if (!frontmatter.ignoreSegment) routeMap[route].breadcrumbs = split.map((value, i) => ["/" + split.slice(1, i+1).join("/"), routeMap["/" + split.slice(1, i+1).join("/")]?.frontmatter.title]).filter(([,title]) => title)
  }

  return routeMap;
}

function resolvePath(fullPath: string) {
  const relativePath = path.relative(PAGES_DIR, fullPath);
    
  // 2. Parse path parts
  const parsed = path.parse(relativePath);
  const fileName = parsed.name; // 'index' or '[slug]'
  const dirName = parsed.dir;   // 'blog' or ''

  // 3. Skip non-page files as defined by configuration (styles, tests, etc) if necessary
  if (!PAGE_EXTENSIONS.includes(parsed.ext)) return;
  if (fileName.startsWith('_') && IGNORE_FILES.includes(fileName)) return;

  // 4. Construct the Route
  let route = '/' + dirName.split(path.sep).join('/');
  
  if (fileName === 'index') {
    // 'blog/index.tsx' -> '/blog'
    if (route === '/.') route = '/'; // Handle root index
  } else {
    // 'blog/[slug].tsx' -> '/blog/[slug]'
    route = route === '/' ? `/${fileName}` : `${route}/${fileName}`;
  }

  // Clean up trailing slashes/dots
  route = route.replace('/.', '').replace('//', '/');
  if (route === '') route = '/';

  // 5. Store relative path to source file
  // Uses 'src/pages/...' or 'pages/...'
  const displayPath = path.relative(process.cwd(), fullPath);
  
  return {displayPath, route}
}

async function getFrontMatter(pathname: string) {
    pathname = path.join(process.cwd(), pathname)

    return frontmatter(await fs.readFile(pathname, { encoding: "utf-8" })).data;
} 

function logMessage(...messages: string[]) {
    console.log(`${"[".blue.bold}${path.basename(process.argv[1]!).blue.bold}${"]".blue.bold} [${new Date().toLocaleTimeString()}]`, ...messages);
}

run(app, process.argv.slice(2))