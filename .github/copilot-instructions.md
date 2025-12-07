<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this repo -->
# Copilot / AI agent instructions — thundercraft5.github.io

Purpose: Help contributors and AI agents be immediately productive in this repository. Keep suggestions specific to this codebase (Next.js + MDX + simple monorepo packages + static projects).

- Big picture:
  - This is a Next.js site (see `next.config.ts`) that serves a mix of MDX pages in `pages/` and standalone static projects under `projects/` and `static/`/`public/`.
  - MDX is enabled for page extensions (`.md`, `.mdx`) and uses `remark-frontmatter` + `remark-mdx-frontmatter` so frontmatter is commonly present in pages.
  - The repo also contains small local packages under `packages/` (e.g. `packages/vector-array`, `packages/native-extensions`) referenced with `file:` in `package.json`. Builds use `lerna`.

- Key developer workflows (commands):
  - Local dev (Next): run `pnpm install` then `pnpm run dev` — starts Next dev server on port `5000` (script `dev` in `package.json`).
  - Build monorepo packages: `pnpm run build` (this runs `lerna build --parallel`).
  - Watch packages during development: `pnpm run watch` (runs `lerna watch --parallel`).
  - Serve legacy/express preview: `pnpm run serve` uses `nodemon` and `./scripts/server.js`.
  - Add new project (site-specific): there's a PowerShell helper referenced by workspace tasks: `./scripts/tasks/create-project.ps1` — can be run via the VS Code task `Site: Add new Project`.

- Project-specific patterns and conventions:
  - MDX frontmatter: frontmatter is parsed into a field named `frontmatter` (see `next.config.ts` remark plugin config). When extracting metadata from MDX files, the repo uses `src/util/readMDXMetadata.ts` which reads files with `gray-matter`.
  - Pages are sometimes plain `.mdx` under `pages/` (see `pages/index.mdx`); components are mixed JS/TSX (example `components/MDXProvider.js` which supplies MDX components). Prefer following nearby file's language when adding new components.
  - Static project folders (in `projects/`) are often standalone static sites (HTML/CSS/JS); updates there are not routed through Next — treat them like static assets unless migrating them to pages.
  - Local packages: packages use simple CommonJS/ESM combos; editing `packages/*` may require running `pnpm run build` or `pnpm run watch` to propagate changes.

- Integration points and gotchas:
  - `next.config.ts` explicitly disables `mdxRs` so MDX runs through remark/rehype plugins. Do not flip MDX runtime to mdxRs in this repo without testing (comment in file).
  - The config warns: do NOT add `turbo: {}` under `experimental` — it is deprecated and breaks validation.
  - The repo uses `file:` dependencies for local packages (see `package.json`) — CI or contributor setups must install dev deps and run `lerna` steps when package sources change.

- Where to look for examples:
  - MDX page example: `pages/index.mdx` (frontmatter, links to `projects/`).
  - MDX provider: `components/MDXProvider.js` (custom MDX components mapping).
  - MDX metadata helper: `src/util/readMDXMetadata.ts` (shows how frontmatter is read).
  - Local package example: `packages/vector-array` (used via `@thundercraft5/vector-array` in `package.json`).
  - Server/legacy scripts: `scripts/server.js` and `scripts/server.min.js`.

- How to respond as an AI assistant (concise rules):
  - Prefer small, focused changes: update the smallest set of files required and run the matching `pnpm`/`lerna` command locally before suggesting broader refactors.
  - When modifying MDX pages, preserve frontmatter keys and naming (frontmatter is read elsewhere by utilities).
  - When changing package code under `packages/`, remind to run `pnpm run build` or `pnpm run watch` and note the package is a `file:` dependency.
  - Avoid changing `next.config.ts` experimental flags unless you provide justification and a simple rollback path.

If anything here is unclear or you'd like me to include more examples (CI, tests, or component conventions), tell me which area to expand.
