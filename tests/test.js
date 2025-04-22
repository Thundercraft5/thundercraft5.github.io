import { promises as fs } from "fs";

const { parse } = await import("../builds/out/node-html-parser/index.js"),
	html = await fs.readFile("./tests/test.html", { encoding: "utf8" });

console.time("html");
const res = parse(html.replace(/<main[^\0]*?>[^\0]*?<\/main>/u), {
	blockTextElements: {
		script: true, // keep text content when parsing
	},
});

res.removeWhitespace();
res.querySelectorAll("script").forEach(s => {
	const { rawText } = s;

	if ([
		"typeof window.__tcfapi ===",
		"function genUID",
		"var _plc={",
		"var ads={",
		"function trackFCPPageView(config)",
	].some(s => rawText.includes(s))
	|| [
		"https://www.fastly-insights.com/",
		"https://static.wikia.nocookie.net/silversurfer/",
		"https://services.fandom.com/icbm/",

	].some(site => s.rawAttrs.includes(site))) s.remove();
});
res.querySelector(".page-footer")?.remove();
res.querySelectorAll(".global-footer__section").forEach(e => e?.remove());
res.toString();
console.timeEnd("html");