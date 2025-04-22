/* eslint-disable new-cap */
import "colors";

import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import del from "del";
import { build, formatMessages, serve } from "esbuild";
import { promises as fs } from "fs";
import path from "path";

const projects = (await fs.readdir("./projects/"))
	.filter(path => path !== "js" && path !== "css" && !path.match(/.\w+$/))
	.map(project => path.resolve("./projects/", project));

console.log(projects.map(project => path.resolve(project, "js/dist/**")));
await del(projects.map(project => path.resolve(project, "js/dist/**")));

const watch = process.env.NODE_WATCH
		? {
			onRebuild(error, res) {
				if (error) console.warn(`${ "[Watch]".bold.blue } ${ `${ error?.message }`.red }`);
				else console.log(`${ "[Watch]".bold.blue } ${ "Rebuild successful!".white }`);
			},
		}
		: undefined,
	workerEntryPoints = [
		"vs/language/json/json.worker.js",
		"vs/language/css/css.worker.js",
		"vs/language/html/html.worker.js",
		"vs/language/typescript/ts.worker.js",
		"vs/editor/editor.worker.js",
	],
	plugins = [
		NodeModulesPolyfillPlugin(),
	];

build({
	entryPoints: workerEntryPoints.map(entry => `./node_modules/monaco-editor/esm/${ entry }`),
	bundle: true,
	format: "iife",
	outbase: "./node_modules/monaco-editor/esm/",
	outdir: "./js/dist",
	allowOverwrite: true,
	plugins,
	target: ["esnext"],
	sourcemap: true,
});

build({
	entryPoints: ["./node_modules/eslint/lib/linter/linter.js"],
	bundle: true,
	format: "esm",
	outdir: "./js/dist",
	target: ["esnext"],
	allowOverwrite: true,
	plugins,
	sourcemap: true,
});

const buildOptions = {
	sourcemap: true,
	entryPoints: ["./js/index.js"],
	bundle: true,
	format: "iife",
	outdir: "./js/dist",
	loader: {
		".ttf": "file",
	},
	target: ["esnext"],
	allowOverwrite: true,
	plugins,
	watch,
};

if (process.env.NODE_WATCH && process.env.PORT) {
	const builder = await serve({
		port: +process.env.PORT || 3000,
		servedir: "../../",
		onRequest({ method, path, status, timeInMS }) {
			console.log(`${ "[Server]".bold.blue } ${ method.green } ${ status.toString().yellow } ${ `http://localhost:${ process.env.PORT }${ path }`.blue } in ${ `${ timeInMS }ms`.cyan.blue }`);
		},
	}, buildOptions).then(res => {
		console.log(`${ "[Server]".blue.bold } ${ `Listening on ${ process.env.PORT.toString().magenta.bold }`.white }`);
	});
} else await build(buildOptions).then(result => {
	if (watch) console.log(`${ "[Watch]".bold.blue } ${ "Watching for changes...".white }`);
});