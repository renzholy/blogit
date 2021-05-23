/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import type { AppProps } from 'next/app'
import 'normalize.css'

import Layout from '../components/layout'
import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
