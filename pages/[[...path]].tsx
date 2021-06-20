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
  isIndex: boolean
}

type Params = {
  path?: string[]
}

export default function Path(props: Props) {
  const title = useMemo(() => props.data?.match(/^# (.+)/)?.[1], [props.data])

  if (!props.data) {
    return null
  }
  return (
    <>
      <Head>
        <title>{title || process.env.NEXT_PUBLIC_TITLE || 'Blogit'}</title>
        <meta name="description" content={props.data.substring(0, 256)} />
        <link
          rel="shortcut icon"
          type="image/png"
          href={`https://github.com/${
            process.env.NEXT_PUBLIC_REPOSITORY?.split('/')[0]
          }.png?size=128`}
        />
      </Head>
      <MarkdownRender
        className={css`
          margin: 96px auto 32px;
          max-width: var(--max-width);
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
      {props.isIndex ? null : <Utterances />}
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
      isIndex: !context.params.path?.join('/'),
    },
  }
}
