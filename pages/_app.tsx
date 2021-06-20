import React from 'react'
import type { AppProps } from 'next/app'
import Layout from 'components/layout'
import { injectGlobal } from '@emotion/css'
import './global.css'

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
injectGlobal`
::-webkit-scrollbar {
  display: none;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
}

:root {
  --max-width: 900px;
}
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
