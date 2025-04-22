import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const config: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};const withMDX = createMDX({
	// Add markdown plugins here, as desired
});


export default config;
