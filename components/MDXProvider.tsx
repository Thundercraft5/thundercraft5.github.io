import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { useMDXComponents } from '../pages/mdx-components'


export default ({ children }) => (
  <MDXProvider components={useMDXComponents(children)}>
    {children}
  </MDXProvider>
)