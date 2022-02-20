import MonacoEditorPlugin from "monaco-editor-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseConfig = {
	devtool: "cheap-module-source-map",
	mode: "development",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "js/dist"),
		publicPath: path.resolve(__dirname, "js/dist"),
	},
};
/** @type {import("webpack").Configuration} */
const config = {
	name: "EslintEditor-config",
	entry: path.resolve(__dirname, "js/index.js"),
	stats: "errors-only",
	module: {
		rules: [
			{
				test: /\.js$/u,
				loader: "esbuild-loader",
				options: {
					target: "esnext",
				},
			},
			{
				test: /\.css$/u,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.ttf$/u,
				use: ["file-loader"],
			},
		],
	},
	plugins: [
		new MonacoEditorPlugin(),
	],
	...baseConfig,
};

export default config;