import { css } from '@linaria/core'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useMemo } from 'react'

import MarkdownRender from '../components/markdown-render'
import Utterances from '../components/utterances'
import Navigation from '../components/navigation'

const octokit = new Octokit({
  auth: process.env.GHP,
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
        <title>{title}</title>
      </Head>
      <Navigation
        className={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 62px;
          background-color: #24292e;
          padding: 0 32px;
        `}
      />
      <div
        className={css`
          margin: 94px auto 32px;
          max-width: 900px;
          padding: 0 32px;
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
              border-top: 1px solid #eaecef;
              padding: 16px 0;
              font-size: 14px;
              color: #6a737d;
              display: flex;
              justify-content: flex-end;
            `}>
            Last Modified:&nbsp;
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
  if (!process.env.NEXT_PUBLIC_INDEX) {
    throw new Error('please set process.env.NEXT_PUBLIC_INDEX')
  }
  const content = await octokit.rest.repos.getContent({
    owner: process.env.NEXT_PUBLIC_OWNER,
    repo: process.env.NEXT_PUBLIC_REPO,
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
