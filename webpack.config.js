import glob from "glob";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webpackConfigs = await Promise.all(glob.sync("./projects/*/webpack.config.js").map(async project => {
	const { default: config } = await import(project);

	return config;
}));

console.log(webpackConfigs);
export default webpackConfigs;