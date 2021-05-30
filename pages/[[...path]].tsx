import { css } from '@linaria/core'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useMemo } from 'react'

import MarkdownRender from '../components/markdown-render'
import Utterances from '../components/utterances'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

type Props = {
  lastModified: string | null
  data: string | null
}

type Params = {
  path?: string[]
}

export default function Path(props: Props) {
  const title = useMemo(() => props.data?.match(/# (.+)/)?.[1], [props.data])

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
          href={`https://github.com/${process.env.NEXT_PUBLIC_OWNER}.png?size=128`}
        />
      </Head>
      <div
        className={css`
          margin: 96px auto 32px;
          max-width: 900px;
          padding: 0 16px;
        `}>
        <MarkdownRender
          className={css`
            padding: 0;
          `}>
          {props.data}
        </MarkdownRender>
        {props.lastModified ? (
          <footer
            className={css`
              border-bottom: 1px solid #eaecef;
              padding: 16px 0;
              font-size: 14px;
              color: #6a737d;
              display: flex;
              justify-content: flex-end;
            `}>
            last modified:&nbsp;
            <time title={props.lastModified}>
              {dayjs(props.lastModified).format('YYYY-MM-DD')}
            </time>
          </footer>
        ) : null}
        <Utterances />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  if (!process.env.NEXT_PUBLIC_OWNER) {
    throw new Error('please set process.env.NEXT_PUBLIC_OWNER')
  }
  if (!process.env.NEXT_PUBLIC_REPO) {
    throw new Error('please set process.env.NEXT_PUBLIC_REPO')
  }
  if (!process.env.NEXT_PUBLIC_BRANCH) {
    throw new Error('please set process.env.NEXT_PUBLIC_BRANCH')
  }
  const ref = await octokit.rest.git.getRef({
    owner: process.env.NEXT_PUBLIC_OWNER,
    repo: process.env.NEXT_PUBLIC_REPO,
    ref: `heads/${process.env.NEXT_PUBLIC_BRANCH}`,
  })
  const tree = await octokit.rest.git.getTree({
    owner: process.env.NEXT_PUBLIC_OWNER,
    repo: process.env.NEXT_PUBLIC_REPO,
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
  if (!process.env.NEXT_PUBLIC_OWNER) {
    throw new Error('please set process.env.NEXT_PUBLIC_OWNER')
  }
  if (!process.env.NEXT_PUBLIC_REPO) {
    throw new Error('please set process.env.NEXT_PUBLIC_REPO')
  }
  if (!process.env.NEXT_PUBLIC_BRANCH) {
    throw new Error('please set process.env.NEXT_PUBLIC_BRANCH')
  }
  if (!process.env.NEXT_PUBLIC_INDEX) {
    throw new Error('please set process.env.NEXT_PUBLIC_INDEX')
  }
  const content = await octokit.rest.repos.getContent({
    owner: process.env.NEXT_PUBLIC_OWNER,
    repo: process.env.NEXT_PUBLIC_REPO,
    ref: `heads/${process.env.NEXT_PUBLIC_BRANCH}`,
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
    },
  }
}
