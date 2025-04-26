import React from 'react'
import MDXProvider from '../components/MDXProvider'
import NextConfig from '../next.config.js'
import Head from 'next/head'
import { giantText } from './_app.module.scss'
import Link from 'next/link';
export default ({ Component, pageProps }: { Component: React.Component<any, any, any>, pageProps: React.PropsWithChildren }) => (
  <MDXProvider>
    <Head>
      <link rel="icon" href="/favicon.ico" type="image/x-icon"  />
      
    </Head>
    <Component {...pageProps} />
  </MDXProvider>
)
