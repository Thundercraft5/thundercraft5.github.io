import createMDX from "@next/mdx";
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

const config = {
	reactStrictMode: true,
	poweredByHeader: false,
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	sassOptions: {},
	experimental: {
		mdxRs: {
			mdxType: "gfm"
		}
	},
};
console.log("remarkGfm:", remarkGfm); // 
const withMDX = createMDX({
	extension: /\.mdx?$/,
	options: {

		rehypePlugins: [],
	}
	// remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, {name: 'matter'}]]
});

export default withMDX(config);
