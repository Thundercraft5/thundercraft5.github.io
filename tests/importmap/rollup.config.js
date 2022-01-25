/* eslint-disable new-cap */
import { defineConfig } from "rollup";
import CommonJS from "@rollup/plugin-commonjs";
import JSON from "@rollup/plugin-json";
import NodePollyfills from "rollup-plugin-polyfill-node";
import NodeResolve from "@rollup/plugin-node-resolve";

export default defineConfig({
	input: "./node_modules/eslint/lib/linter/index.js",
	output: {
		file: "./dist/out-rollup.js",
		format: "umd",
		name: "ESLint",
		amd: {
			id: "ESLint",
		},
	},
	plugins: [
		CommonJS(),
		JSON(),
		NodePollyfills(),
		NodeResolve({ browser: true }),
	],
});