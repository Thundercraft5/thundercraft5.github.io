import { build } from "esbuild";
import parseArgs from "minimist";
import del from "del";
import path from "path";

console.log(parseArgs(process.argv));
const { package: lib, path: inputPath } = parseArgs(process.argv);

if (!lib || !inputPath) {
	console.error(new Error("No library or input path specified!"));
	process.exit(300);
}
const outputPath = `./out/${ lib }/index.js`;

console.log(`Building npm package "${ lib }"...`);

await del([`./out/${ lib }/**`]);
build({
	bundle: true,
	minify: true,
	sourcemap: true,
	sourcesContent: true,
	outfile: outputPath,
	entryPoints: [path.resolve(`../node_modules/${ lib }`, inputPath)],
	format: "esm",
}).then(() => {
	console.log(`Successfully built npm package "${ lib }" to "${ path.relative(process.cwd(), outputPath) }"`);
});