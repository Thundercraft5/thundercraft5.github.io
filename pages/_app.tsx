import React from 'react'
import MDXProvider from '../components/MDXProvider'
import NextConfig from '../next.config.js'
import '../styles/global.scss'
import Head from 'next/head'
import { giantText, mainContent } from './_app.module.scss'
import Link from 'next/link';
import { TopNav } from '../components/TopNav'
import Footer from '../components/Footer'
// import $ from 'jquery'

// globalThis.$ = $; // HACK: make jQuery globally available for legacy project scripts 

export default ({ Component, pageProps }: { Component: any, pageProps: React.PropsWithChildren }) => {
  // Try to read frontmatter exported from the MDX page module or passed in pageProps
  const fm = (Component && (Component as any).frontmatter) ?? (pageProps && (pageProps as any).frontmatter) ?? undefined

  // Helpful debug: log when frontmatter is missing vs present
  if (!fm) {
    console.debug('[_app] frontmatter missing for page', Component?.displayName || Component?.name || 'Unknown')
  } else {
    console.debug('[_app] frontmatter for page', fm)
  }

  return (
    <MDXProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href='/styles/global.scss' />
        <title>{fm ? fm.title ?? fm : 'Thundercraft5'}</title>
      </Head>
      <TopNav />
      <main className={mainContent}><Component {...pageProps} /></main>
      <Footer />
    </MDXProvider >
  )
}
