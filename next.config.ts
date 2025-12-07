import createMDX from "@next/mdx";
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import { typescript } from "monaco-editor";
import { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';


const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: isProd ? '/thundercraft5.github.io' : '',
  poweredByHeader: false,
  pageExtensions: ["mdx", "tsx", "ts"],
  output: "export",
  sassOptions: {},
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
  },
  eslint: {
    "ignoreDuringBuilds": true
  },
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
      ['remark-callouts'],
      ['remark-mdx-frontmatter', { name: 'frontmatter' }] // Array syntax allows passing options
    ],
    rehypePlugins: [],
  },
});


export default withMDX(nextConfig);
