import fs from "fs/promises";
import path from "path";
import chokidar from "chokidar";
import nextJSConfig from "../next.config.ts"; 
import { command, subcommands, run, string, restPositionals } from "cmd-ts";
import frontmatter from "gray-matter";
import "colors";
import { JSDOM } from "jsdom";
import { mode } from "mathjs";

// --- CONFIGURATION ---
const SITE_URL = process.env.SITE_URL ?? 'https://thundercraft5.github.io';
const MANIFEST_DIR = path.join(process.cwd(), "public");
const LINKS_MANIFEST_PATH = path.join(MANIFEST_DIR, "links-manifest.json");
const ROUTES_MANIFEST_PATH = path.join(MANIFEST_DIR, "routes-manifest.json");
const SITEMAP_INDEX_PATH = path.join(MANIFEST_DIR, "sitemap.xml");
const SITEMAP_CHILD_PATH = path.join(MANIFEST_DIR, "sitemap-1.xml");

const IGNORE_FILES = ['_app', '_document', '[slug]', '_error', 'api', '404', '500', 'bad-request'];
const PAGE_EXTENSIONS = (nextJSConfig.pageExtensions || ['tsx', 'ts', 'jsx', 'js']).map(v => `.${v}`);

// Determine Pages Directory
const PAGES_DIR = await (async () => {
    const srcPages = path.join(process.cwd(), 'src/pages');
    try {
        await fs.access(srcPages);
        return srcPages;
    } catch {
        return path.join(process.cwd(), 'pages');
    }
})();
let isWriting = false;

// --- TYPES ---
type GraphNode = {
    id: string;
    name: string;
    external: boolean;
    mtime?: number; // Added for caching
    icon?: string;
    iconUrl?: string;
};

type GraphLink = {
    source: string;
    target: string;
    title?: string;
    toTitle?: string;
    external: boolean;
};

type Manifest = {
    nodes: GraphNode[];
    links: GraphLink[];
};

// --- CLI DEFINITIONS ---

const generate = command({
    name: "generate",
    args: {},
    async handler() {
        await writeManifest();
    }
});

const watch = command({
    name: "watch",
    args: {
        directory: restPositionals({ type: string })
    },
    async handler({ directory }) {
        logMessage("Watching directories: ", ...directory);
        chokidar.watch(directory, {
            persistent: true,
            ignoreInitial: true,
            ignored: (path) => isWriting || path.includes('node_modules') || path.includes('.git')
        }).on("all", async (event, path) => {
            isWriting = true;

            logMessage(`File ${event}: ${path}`);
            await writeManifest();
            await new Promise(res => setTimeout(res, 500));
            
            isWriting = false;
        });
    }
});

const app = subcommands({
    name: "manage-manifests",
    cmds: { generate, watch }
});

// --- CORE LOGIC ---

async function writeManifest() {
    logMessage("Regenerating manifests...");
    
    // 1. Routes (Needed for paths)
    const routeMap = await generateRouteMap();
    await fs.writeFile(ROUTES_MANIFEST_PATH, JSON.stringify(routeMap, null, 2));
    
    // 2. Links (Smart Caching)
    const linksMap = await generateLinksMap(routeMap);
    await fs.writeFile(LINKS_MANIFEST_PATH, JSON.stringify(linksMap, null, 2));
    
    // 3. Sitemaps
    await generateSitemaps(routeMap);

    // 4. Update Frontmatter
    await updateFrontmatter()
    
    logMessage("Done.");
}

async function generateLinksMap(routeMap: Record<string, any>) {
    const files = await getFileList(PAGES_DIR);
    
    const newNodes: GraphNode[] = [];
    const newLinks: GraphLink[] = [];

    // --- 1. LOAD CACHE ---
    let cachedNodes: Map<string, GraphNode> = new Map();
    let cachedLinksBySource: Map<string, GraphLink[]> = new Map();
    let externalMetadataCache: Map<string, GraphNode> = new Map();

    try {
        const prevContent = await fs.readFile(LINKS_MANIFEST_PATH, "utf8");
        const prevJson: Manifest = JSON.parse(prevContent);
        
        if (Array.isArray(prevJson.nodes)) {
            prevJson.nodes.forEach(n => {
                cachedNodes.set(n.id, n);
                if (n.external) {
                    externalMetadataCache.set(n.id, n); // Persist external metadata
                }
            });
        }
        if (Array.isArray(prevJson.links)) {
            prevJson.links.forEach(l => {
                const group = cachedLinksBySource.get(l.source) || [];
                group.push(l);
                cachedLinksBySource.set(l.source, group);
            });
        }
        logMessage(`Loaded cache: ${cachedNodes.size} nodes.`);
    } catch (e) {
        logMessage("No valid cache found. Starting fresh.");
    }

    // --- 2. PROCESS FILES (INTERNAL NODES) ---
    // Regex Patterns
    const patterns = [
        /\[.*?\]\((.*?)\)/g,                 // Markdown
        /href=["'](\/blog\/posts\/.*?)["']/g, // HTML
        /href=\{["'](\/blog\/posts\/.*?)["']\}/g // JSX
    ];

    for (const fullPath of files) {
        const { displayPath, route } = resolvePath(fullPath) ?? {};
        if (!displayPath || !route) continue;

        const stat = await fs.stat(fullPath);
        const currentMtime = stat.mtimeMs;

        // CHECK CACHE
        const cachedNode = cachedNodes.get(route);
        
        if (cachedNode && cachedNode.mtime === currentMtime) {
            // CACHE HIT: Reuse node and links
            newNodes.push(cachedNode);
            
            const relevantLinks = cachedLinksBySource.get(route) || [];
            newLinks.push(...relevantLinks);
            
            // logMessage(`Cache HIT: ${route}`);
        } else {
            // CACHE MISS: Read file and Parse
            // logMessage(`Cache MISS: ${route} (Updated)`);
            const content = await fs.readFile(fullPath, "utf8");
            const meta = await getFrontMatter(displayPath);
            
            // Push Internal Node
            newNodes.push({ 
                id: route, 
                name: meta?.title ?? '', 
                external: false,
                mtime: currentMtime // Save mtime for next run
            });

            // Extract Links
            for (const pattern of patterns) {
                const matches = content.matchAll(pattern);
                for (const match of matches) {
                    const target = match[1];
                    newLinks.push({ 
                        source: route, 
                        target, 
                        title: meta.title, 
                        external: !target.startsWith('/') 
                    });
                }
            }
        }
    }

    // --- 3. PROCESS EXTERNAL NODES (METADATA FETCHING) ---
    const processedTargets = new Set<string>();
    
    // Create a list of fetch tasks
    await Promise.allSettled(newLinks.map(async (link) => {
        if (!link.external) return;
        
        // Deduplicate processing per run
        if (processedTargets.has(link.target)) return;
        processedTargets.add(link.target);

        // 1. Check if we already have this external node in our new list? (Rare)
        // 2. Check Cache (Previous Manifest)
        if (externalMetadataCache.has(link.target)) {
            // Reuse external metadata even if the internal file changed
            return; 
        }

        // 3. Fetch Fresh Data (Scrape)
        logMessage(`Fetching metadata for new link: ${link.target}`);
        const data = await getPageData(link.target);
        
        let base64Icon = "";
        if (data.icon) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                const iconRes = await fetch(data.icon, { 
                    signal: controller.signal,
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)' }
                });
                clearTimeout(timeoutId);

                if (iconRes.ok) {
                    const contentType = iconRes.headers.get('content-type') || 'image/png';
                    const buffer = Buffer.from(await iconRes.arrayBuffer());
                    base64Icon = `data:${contentType};base64,${buffer.toString('base64')}`;
                }
            } catch (err) {
                console.warn(`Failed to load icon ${data.icon}:`, (err as Error).message);
            }
        }

        // Add to our running cache so we can build the node list later
        externalMetadataCache.set(link.target, {
            id: link.target,
            name: data.title || link.target,
            external: true,
            icon: base64Icon,
            iconUrl: data.icon
        });
    }));

    // --- 4. BUILD FINAL NODE LIST ---
    // Ensure every external link has a corresponding node
    newLinks.forEach(link => {
        if (link.external) {
            if (!newNodes.find(n => n.id === link.target)) {
                const metadata = externalMetadataCache.get(link.target);

                newNodes.push({
                    id: link.target,
                    name: metadata?.name || link.target,
                    external: true,
                    icon: metadata?.icon,
                    iconUrl: metadata?.iconUrl
                });
            }
        } else {
             // Fill in toTitle for internal links
             if (!link.toTitle) {
                 link.toTitle = newNodes.find(n => n.id === link.target)?.name || link.title;
             }
        }
    });

    const externals = newNodes.filter(value => value.external);
    externals.forEach(node => {
        if ((!node.icon) && node.external) {
            externals.forEach((value) => {
                // console.log(node, value)
                if (value.icon && new URL(node.id).origin === new URL(value.id).origin) {
                    node.icon = value.icon;
                }
            })
        }
    })


    return { nodes: newNodes, links: newLinks };
}

async function updateFrontmatter() {
  const files = await getFileList(PAGES_DIR);

  await Promise.all(files.map(async (file) => {
    const { displayPath, route } = resolvePath(file) ?? {};
    if (!displayPath || !route) return;

    const content = await fs.readFile(displayPath, "utf8");
    const { data, content: body } = frontmatter(content);

    data['last-updated'] = new Date().toISOString();
    data['created'] = data['created'] || await fs.stat(displayPath).then(stat => stat.birthtime.toISOString());

    const newFrontmatter = frontmatter.stringify(body, data);
    await fs.writeFile(displayPath, newFrontmatter, "utf8");
  }))
}

async function generateSitemaps(routeMap: Record<string, any>) {
    // ... (Keep existing Sitemap logic exactly as is) ...
    const urls: Array<{ loc: string; lastmod?: string; changefreq?: string }> = [];

    for (const [route, { path: displayPath, frontmatter }] of Object.entries(routeMap)) {
        if (route.includes('[')) continue;
        if (frontmatter?.sitemap === false || frontmatter?.noindex) continue;

        let lastmod: string | undefined;
        if (frontmatter?.date) {
            try { lastmod = new Date(frontmatter.date).toISOString().split('T')[0]; } catch {}
        }
        if (!lastmod) {
            try {
                const stat = await fs.stat(path.join(process.cwd(), displayPath));
                lastmod = stat.mtime.toISOString().split('T')[0];
            } catch {}
        }

        urls.push({
            loc: SITE_URL.replace(/\/$/, '') + route,
            lastmod,
            changefreq: frontmatter?.changefreq ?? 'daily'
        });
    }

    const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    const urlContent = urls.map(u => 
        `  <url>\n    <loc>${u.loc}</loc>\n    ` +
        (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>\n    ` : '') +
        `<changefreq>${escapeXml(u.changefreq!)}</changefreq>\n  </url>`
    ).join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlContent}\n</urlset>`;
    await fs.writeFile(SITEMAP_CHILD_PATH, sitemapXml);

    const today = new Date().toISOString().split('T')[0];
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL.replace(/\/$/, '')}/sitemap-1.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    await fs.writeFile(SITEMAP_INDEX_PATH, indexXml);
    logMessage('Updated sitemaps.');
}

// --- UTILS ---

async function getFileList(dir: string): Promise<string[]> {
    let results: string[] = [];
    const list = await fs.readdir(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await getFileList(filePath));
        } else {
            results.push(filePath);
        }
    }
    return results;
}



function resolvePath(fullPath: string) {
    const relativePath = path.relative(PAGES_DIR, fullPath);
    const parsed = path.parse(relativePath);
    
    if (!PAGE_EXTENSIONS.includes(parsed.ext)) return;
    if (parsed.name.startsWith('_') || IGNORE_FILES.includes(parsed.name)) return;

    let route = '/' + parsed.dir.split(path.sep).join('/');
    if (parsed.name === 'index') {
        if (route === '/.') route = '/';
    } else {
        route = route === '/' ? `/${parsed.name}` : `${route}/${parsed.name}`;
    }

    route = route.replace('/.', '').replace('//', '/');
    if (route === '') route = '/';

    const displayPath = path.relative(process.cwd(), fullPath);
    return { displayPath, route };
}

async function generateRouteMap() {
    const files = await getFileList(PAGES_DIR);
    const routeMap: Record<string, any> = {};

    for (const fullPath of files) {
        const { displayPath, route } = resolvePath(fullPath) ?? {};
        if (!displayPath || !route) continue;
        const frontmatter = await getFrontMatter(displayPath);
        routeMap[route] = { path: displayPath, frontmatter, breadcrumbs: [] };
    }

    for (const [route, { frontmatter }] of Object.entries(routeMap)) {
        if (frontmatter.ignoreSegment) continue;
        const split = route.split("/");
        routeMap[route].breadcrumbs = split
            .map((_, i) => {
                const partial = "/" + split.slice(1, i + 1).join("/");
                const matched = routeMap[partial];
                if (matched && matched.frontmatter.title) {
                    return [partial, matched.frontmatter.title];
                }
                return null;
            })
            .filter(Boolean);
    }
    return routeMap;
}

async function getFrontMatter(relativePath: string) {
    const fullPath = path.join(process.cwd(), relativePath);
    try {
        const content = await fs.readFile(fullPath, "utf-8");
        return frontmatter(content).data;
    } catch {
        return {};
    }
}

async function scrape(url: string) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); 

        const response = await fetch(url, { 
            signal: controller.signal,
            // headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)' }
        });
        clearTimeout(timeoutId);

        if (!response.headers.get('content-type')?.includes('text/html')) {
            console.warn("INVALID RESPONSE", response.headers)
            return { title: getUrlFinalSegment(url), icon: "" };
        }

        const html = await response.text();
        const dom = new JSDOM(html, { url });
        const doc = dom.window.document;

        const title = doc.querySelector('title')?.textContent || doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        let icon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') || 
                   doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') || "";

        if (icon && !icon.startsWith('http') && !icon.startsWith('data:')) {
            try { icon = new URL(icon, url).href; } catch {}
        }

        return { title: (title || getUrlFinalSegment(url)).trim(), icon };
    } catch (ex) {
        console.warn(ex);
        return { title: getUrlFinalSegment(url), icon: "" };
    }
}

function getUrlFinalSegment(url: string): string {
    try {
        const u = new URL(url);
        if (u.pathname === '/' || u.pathname === '') return u.hostname;
        const segments = u.pathname.split('/');
        return segments.pop() || segments.pop() || u.hostname;
    } catch {
        return 'External Link';
    }
}

async function getPageData(url: string) {
    if (!url.startsWith('http')) url = 'https://' + url;
    return scrape(url);
}

function logMessage(...messages: string[]) {
    // @ts-ignore
    console.log(`${"[".blue.bold}${path.basename(process.argv[1]).blue.bold}${"]".blue.bold} [${new Date().toLocaleTimeString()}]`, ...messages);
}

run(app, process.argv.slice(2));