import { css } from '@emotion/css'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useMemo } from 'react'
import { truncate } from 'lodash'
import MarkdownRender from 'components/markdown-render'
import Utterances from 'components/utterances'
import { getStaticPaths, getStaticProps, Props } from 'libs/static'

export default function Path(props: Props) {
  const title = useMemo(
    () =>
      props.data?.match(/^# (.+)/)?.[1] ||
      process.env.NEXT_PUBLIC_TITLE ||
      'Blogit',
    [props.data],
  )
  const description = useMemo(() => {
    if (!props.data) {
      return undefined
    }
    return truncate(
      props.data.startsWith(`# ${title}\n\n`)
        ? props.data.replace(`# ${title}\n\n`, '')
        : props.data,
      { length: 256 },
    )
  }, [props.data, title])
  const url = useMemo(
    () =>
      process.env.NEXT_PUBLIC_CNAME
        ? `https://${process.env.NEXT_PUBLIC_CNAME}/${props.pathname || ''}`
        : undefined,
    [props.pathname],
  )
  const [owner] = process.env.NEXT_PUBLIC_REPOSITORY?.split('/') || []
  const date = useMemo(
    () =>
      props.lastModified
        ? dayjs(props.lastModified).format('YYYY-MM-DD')
        : undefined,
    [props.lastModified],
  )

  if (!props.data) {
    return null
  }
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/png"
          href={`https://github.com/${owner}.png?size=128`}
        />
        <title>{title}</title>
        <meta name="author" content={owner} />
        <meta name="date" content={date} />
        <meta name="application-name" content={title} />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#24292e" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="blog" />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={process.env.NEXT_PUBLIC_TITLE} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:domain" content={process.env.NEXT_PUBLIC_CNAME} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <MarkdownRender
        className={css`
          margin: 96px auto 32px;
          max-width: var(--max-width);
          min-height: calc(
            100vh - 96px - 2 * 64px - 2px - ${props.pathname ? 302 : 0}px
          );
        `}>
        {props.data}
      </MarkdownRender>
      {props.lastModified ? (
        <footer
          className={css`
            margin: 16px auto;
            padding: 0 20px;
            max-width: var(--max-width);
            font-size: 14px;
            color: #6a737d;
            display: flex;
            justify-content: flex-end;
          `}>
          Last modified:&nbsp;
          <time title={props.lastModified}>{date}</time>
        </footer>
      ) : null}
      {props.pathname ? <Utterances /> : null}
    </>
  )
}

export { getStaticPaths, getStaticProps }
