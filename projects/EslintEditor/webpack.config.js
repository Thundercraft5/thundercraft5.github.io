import MonacoEditorPlugin from "monaco-editor-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";

import del from "del";
import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";

await del(["./js/dist/**"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseConfig = {
	devtool: "inline-source-map",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "js/dist"),
	},
};
/** @type {import("webpack").Configuration} */
const config = {
	name: "EslintEditor-config",
	entry: path.resolve(__dirname, "js/index.js"),
	stats: "summary",
	/*
	 * optimization: {
	 * 	concatenateModules: true,
	 * 	mergeDuplicateChunks: true,
	 * 	minimize: true,
	 * },
	 */
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
		new webpack.HotModuleReplacementPlugin(),
		new MonacoEditorPlugin(),
		new NodePolyfillPlugin(),
	],
	experiments: {
		outputModule: true,
		topLevelAwait: true,
	},
	...baseConfig,
};

export default config;