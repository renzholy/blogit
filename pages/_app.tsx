/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import 'normalize.css'

import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Blogit</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
