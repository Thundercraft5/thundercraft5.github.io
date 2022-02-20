/* eslint-disable multiline-ternary */
import chokidar from "chokidar";
import express from "express";
import Kevin from "kevin-middleware";
import glob from "glob";
import morgan from "morgan";
import { promises as fs, constants as fsConstants } from "fs";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import "colors";

async function filePathExists(filePath) {
	try {
		await fs.access(filePath, fsConstants.F_OK);

		return true;
	} catch {
		return false;
	}
}

const webpackConfigs = await Promise.all(glob.sync("./projects/*/webpack.config.js").map(async project => {
	console.log(path.join("../", project));

	const { default: config } = await import(path.join("../", project).replace("\\", "/"));

	config.entry = path.resolve(project, config.entry);

	return config;
}));

console.log(webpackConfigs);
const PORT = process.env.PORT || 3000;
const SERVER = express();
const kevin = new Kevin(webpackConfigs, {
	kevinPublicPath: `http://localhost:${ PORT }`,
});

SERVER.use(kevin.getMiddleware());
SERVER.use(morgan((tokens, req, res) => {
	const method = tokens.method(req, res),
		path = tokens.url(req, res),
		code = tokens.status(req, res),
		length = tokens.res(req, res, "content-length"),
		responseTime = tokens["response-time"](req, res);

	return `${ "[Server]".blue.bold } ${ method.magenta } ${
		code >= 500 ? code.red.bold
		: code >= 400 ? code.yellow.bold
		: code >= 300 ? code.cyan.bold
		: code >= 200 ? code.green.bold
		: 0
	} ${ path.blue }`;
}));

// Normal requests
SERVER.get("*", async({ url }, res, next) => {
	const normalizedPath = path.join(path.resolve("."), url);
	const absolutePathExists = await filePathExists(normalizedPath);

	if (absolutePathExists && !path.extname(url)) {
		const dirStats = await fs.stat(normalizedPath);

		if (dirStats.isDirectory())
			return !url.endsWith("/")
				? res.redirect(301, `${ url }/`)
				: res.sendFile(path.join(normalizedPath, "index.html"));
	} else if (absolutePathExists) return res.sendFile(normalizedPath);

	return next();
});
SERVER.all("*", ({ method }, res) => {
	if (method !== "GET") res.status(405).sendFile(path.resolve("./405.html"));
	else res.status(404).sendFile(path.resolve("./404.html"));
});
SERVER.use((error, req, res) => {
	res.status(500).sendFile(path.resolve("./500.html"));
});
SERVER.listen(PORT, () => {
	console.log(`${ "[Server]".blue.bold } listening on port ${ PORT.toString().cyan }`);
});