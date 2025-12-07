import createMDX from "@next/mdx";
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  sassOptions: {},
  "allowedDevOrigins": ["172.29.112.1", "localhost"],
  experimental: {
    // mdxRs must be false to use remark/rehype plugins
    mdxRs: false,
    // ⚠️ Do NOT include 'turbo: {}' here. It is deprecated and causes validation errors.
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      ['remark-gfm'],
      ['remark-frontmatter'],
      ['remark-mdx-frontmatter', { name: 'frontmatter' }] // Array syntax allows passing options
    ],
    rehypePlugins: [],
  },
});


export default withMDX(nextConfig);
;