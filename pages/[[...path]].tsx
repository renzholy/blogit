import { css } from '@emotion/css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useMemo } from 'react'
import MarkdownRender from 'components/markdown-render'
import Utterances from 'components/utterances'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

type Props = {
  lastModified: string | null
  data: string | null
  pathname: string | null
}

type Params = {
  path?: string[]
}

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
    return (
      props.data.startsWith(`# ${title}\n\n`)
        ? props.data.replace(`# ${title}\n\n`, '')
        : props.data
    ).substring(0, 256)
  }, [props.data, title])
  const url = useMemo(
    () =>
      process.env.NEXT_PUBLIC_CNAME
        ? `https://${process.env.NEXT_PUBLIC_CNAME}/${props.pathname || ''}`
        : undefined,
    [props.pathname],
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
          href={`https://github.com/${
            process.env.NEXT_PUBLIC_REPOSITORY?.split('/')[0]
          }.png?size=128`}
        />
        <title>{title}</title>
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
          <time title={props.lastModified}>
            {dayjs(props.lastModified).format('YYYY-MM-DD')}
          </time>
        </footer>
      ) : null}
      {props.pathname ? <Utterances /> : null}
    </>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  if (!process.env.NEXT_PUBLIC_REPOSITORY) {
    throw new Error('please set process.env.NEXT_PUBLIC_REPOSITORY')
  }
  if (!process.env.NEXT_PUBLIC_REF) {
    throw new Error('please set process.env.NEXT_PUBLIC_REF')
  }
  const [owner, ...rest] = process.env.NEXT_PUBLIC_REPOSITORY.split('/')
  const repo = rest.join('/')
  const ref = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: process.env.NEXT_PUBLIC_REF.replace(/^refs\//, ''),
  })
  const tree = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: ref.data.object.sha,
    recursive: 'true',
  })
  return {
    paths: [
      { params: { path: [] } }, // index page
      ...tree.data.tree
        .filter((node) => node.path?.endsWith('.md'))
        .map((node) => ({
          params: { path: node.path!.replace(/\.md$/, '').split('/') },
        })),
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context,
) => {
  if (!context.params) {
    return {
      notFound: true,
    }
  }
  if (!process.env.NEXT_PUBLIC_REPOSITORY) {
    throw new Error('please set process.env.NEXT_PUBLIC_REPOSITORY')
  }
  if (!process.env.NEXT_PUBLIC_REF) {
    throw new Error('please set process.env.NEXT_PUBLIC_REF')
  }
  if (!process.env.NEXT_PUBLIC_INDEX) {
    throw new Error('please set process.env.NEXT_PUBLIC_INDEX')
  }
  const [owner, ...rest] = process.env.NEXT_PUBLIC_REPOSITORY.split('/')
  const repo = rest.join('/')
  const content = await octokit.rest.repos.getContent({
    owner,
    repo,
    ref: process.env.NEXT_PUBLIC_REF.replace(/^refs\//, ''),
    path: `${
      context.params.path?.join('/') || process.env.NEXT_PUBLIC_INDEX
    }.md`,
  })
  return {
    props: {
      lastModified: content.headers['last-modified'] || null,
      data:
        'content' in content.data
          ? Buffer.from(content.data.content, 'base64').toString()
          : null,
      pathname: context.params.path?.join('/') || null,
    },
  }
}
