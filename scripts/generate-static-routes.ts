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
    fs.writeFile(path.relative(process.cwd(), "./public/routes-manifest.json"), JSON.stringify(await generateRouteMap(), null, 2))
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