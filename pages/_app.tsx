import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import MDXProvider from '../components/MDXProvider'
import { TopNav } from '../components/TopNav'
import Footer from '../components/Footer'

// ✅ 1. Import Global Styles (Next.js handles the injection)
import '../styles/global.scss'

// ✅ 2. Import Module Styles as a default object
import { mainContent } from './_app.module.scss'

export default function App({ Component, pageProps }: AppProps) {
  // Try to read frontmatter exported from the MDX page module or passed in pageProps
  const fm = (Component as any).frontmatter ?? (pageProps as any).frontmatter ?? undefined

  // Helpful debug: log when frontmatter is missing vs present
  if (!fm) {
    console.debug('[_app] frontmatter missing for page', Component.displayName || Component.name || 'Unknown')
  } else {
    console.debug('[_app] frontmatter for page', fm)
  }

  return (
    <MDXProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* ✅ Next.js automatically injects the compiled CSS here. Do not add <link rel="stylesheet"> manually. */}
        <title>{fm ? fm.title ?? 'thundercraft5.github.io' : 'Thundercraft5'}</title>
      </Head>

      <TopNav />

      {/* ✅ 3. Use the styles object */}
      <main className={mainContent}>
        <Component {...pageProps} />
      </main>

      <Footer />
    </MDXProvider>
  )
}