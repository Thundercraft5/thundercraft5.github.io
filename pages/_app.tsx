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
import { PageError } from '../src/util/errors'
import DefaultLayout from '../layouts/DefaultLayout'
import BlogLayout from '../layouts/BlogLayout'

export default function App({ Component, pageProps, router }: AppProps) {
  // Try to read frontmatter exported from the MDX page module or passed in pageProps
  const fm = (Component as any).frontmatter ?? (pageProps as any).frontmatter ?? undefined

  // Helpful debug: log when frontmatter is missing vs present
  if (fm) {
    console.debug('[_app] frontmatter missing for page', Component.displayName || Component.name || 'Unknown')
  } else {
    console.debug('[_app] frontmatter for page', fm)
  }

    const isSystemPage = router.pathname === '/404' || router.pathname === '/_error' || router.pathname === '/bad-request';

    // Strict Validation Logic
  if (!isSystemPage) {
    if (!fm) throw new PageError("MISSING_FRONTMATTER", router.route)
    if (!fm['last-updated'] || !fm['created']) throw new PageError("MISSING_FRONTMATTER_DATE", router.route)
  }

  const LayoutComponent = router.pathname.startsWith('/blog') ? BlogLayout : DefaultLayout

  return (
    <MDXProvider>
      <LayoutComponent title={fm.title + ' - thundercraft5.github.io'} frontmatter={fm}>
        <Component {...pageProps} />
      </LayoutComponent>
    </MDXProvider>
  )
}