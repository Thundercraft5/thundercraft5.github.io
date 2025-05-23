/* eslint-disable multiline-ternary */
import chokidar from "chokidar";
import { spawn } from "child_process";
import "colors";

// File utilities
// import * as glob from "glob";

// Server utilities
import express from "express";
import morgan from "morgan";
import http2Express from "http2-express-bridge";
import spdy from "spdy";
import { BLOB, DATA, INLINE, NONE, SELF, expressCspHeader as cspHeaders } from "express-csp-header";
import cors from "cors";
import https from "https";
import http2 from "http2";
import { fileURLToPath } from "url";
import { promises as fs, constants as fsConstants } from "fs";
import path from "path";

async function filePathExists(filePath) {
	try {
		await fs.access(filePath, fsConstants.F_OK);

		return true;
	} catch {
		return false;
	}
}

function logServerMessage(...messages) {
	console.log("[SERVER]".blue.bold, ...messages);
}

const url = "https://nkg-msi";
const PORT = process.env.PORT || 3000;
const APP = http2Express(express);
const serverOptions = {
	cert: await fs.readFile("./localhost.crt"),
	key: await fs.readFile("./localhost.key"),
	allowHTTP1: true,
};

APP.use(cspHeaders({
	directives: {
		"default-src": [BLOB, DATA, SELF],
		"script-src": [BLOB, DATA, SELF, INLINE],
		"style-src": [BLOB, DATA, SELF, INLINE],
		"img-src": ["*"],
		"worker-src": [SELF, INLINE, BLOB, DATA],
		"block-all-mixed-content": true,
	},
}));

APP.use(cors());

APP.use(morgan((tokens, req, res) => {
	const method = tokens.method(req, res),
		path = tokens.url(req, res),
		code = tokens.status(req, res),
		length = tokens.res(req, res, "content-length"),
		responseTime = tokens["response-time"](req, res);

	console.log(req.headers);

	logServerMessage(`${ method?.magenta || "<INVALID METHOD>".red.bold } ${
		code >= 500 ? code.red.bold
		: code >= 400 ? code.yellow.bold
		: code >= 300 ? code.cyan.bold
		: code >= 200 ? code.green.bold
		: 0
	} ${ `${ url }${ path }`.blue } in ${ responseTime.magenta.bold }ms${ req.headers.referer ? ` (originated from ${ req.headers.referer.cyan.bold })` : "" }`);
}));

// Favicon
APP.get("/favicon.ico", (_, res) => res.sendFile(path.resolve("./resources/images/favicon.ico")));

// Normal requests
APP.get("*", async({ url, headers }, res, next) => {
	const normalizedPath = path.join(path.resolve("."), url);
	const absolutePathExists = await filePathExists(normalizedPath);
	const resourceType = headers["sec-fetch-dest"];
	const isResource = ["style", "script"].includes(resourceType);
	const hasExt = path.extname(url);
	const stats = absolutePathExists ? await fs.stat(normalizedPath) : null;

	if (isResource)
		if (absolutePathExists && stats?.isDirectory()) return res.redirect(`${ url }/index.${ resourceType === "style" ? "css" : "js" }`);

	if (absolutePathExists && !hasExt) {
		if (stats?.isDirectory())
			return !url.endsWith("/")
				? res.redirect(301, `${ url }/`)
				: res.sendFile(path.join(normalizedPath, "index.html"));
	} else if (absolutePathExists) return res.sendFile(normalizedPath);
	else if (!hasExt && isResource)
		return res.redirect(301, `${ url }.${ resourceType === "style" ? "css" : "js" }`);

	return next();
});

APP.get("*", (_, res) => res.status(404).sendFile(path.resolve("./404.html")));

APP.use((err, { url, method }, res, next) => {
	if (method !== "GET") return res.status(405).sendFile(path.resolve("./405.html"));
	try {
		decodeURIComponent(url);
	} catch (e) {
		if (e instanceof URIError) return res.status(400).sendFile(path.resolve("./bad-request.html"));
	}
	console.log(err);
	res.status(500).sendFile(path.resolve("./500.html"));
});

function listen(port, address = "localhost") {
	const SERVER = http2.createSecureServer(serverOptions, APP).listen(port, address, () => {
		logServerMessage(`listening on port ${ address?.green }:${ port.toString().cyan }`);
	});
}

/*	
 * listen(PORT, "192.168.1.234");
 * listen(PORT, "192.168.1.231");
 */
// listen(443, "192.168.1.231");
listen(443, "192.168.1.231");
listen(443, "127.0.0.1");
logServerMessage(`View your server at ${ "https://nkg-msi".green.bold }`);