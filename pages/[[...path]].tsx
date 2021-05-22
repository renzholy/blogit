import { css } from '@linaria/core'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import Link from 'next/link'

import MarkdownRender from '../components/markdown-render'

const octokit = new Octokit({
  auth: process.env.PAT,
})

type Props = {
  data?: string
}

type Params = {
  path?: string[]
}

export default function Path(props: Props) {
  return (
    <>
      <nav
        className={css`
          position: fixed;
          top: 0;
          width: calc(100% - 64px);
          height: 62px;
          background-color: #24292e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
        `}>
        <Link href="/">
          <img
            className={css`
              border-radius: 100%;
              cursor: pointer;
            `}
            src={`https://github.com/${process.env.NEXT_PUBLIC_OWNER}.png?size=32`}
            alt="avatar"
          />
        </Link>
        <div
          className={css`
            & a {
              color: #ffffff;
              font-size: 14px;
              font-weight: 600;
              text-decoration: none;
              margin-left: 16px;
            }
          `}>
          <a
            href="https://github.com/RenzHoly"
            target="_blank"
            rel="noreferrer">
            GitHub
          </a>
          <a href="http://twitter.com/rezholy" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a
            href="https://web.okjike.com/u/d25026f2-18ce-48aa-9ea7-c05a25446368"
            target="_blank"
            rel="noreferrer">
            Jike
          </a>
        </div>
      </nav>
      <MarkdownRender
        className={css`
          margin: 78px auto 16px;
          max-width: 900px;
        `}>
        {props.data}
      </MarkdownRender>
      <script
        src="https://utteranc.es/client.js"
        // @ts-ignore
        repo={`${process.env.NEXT_PUBLIC_OWNER}/${process.env.NEXT_PUBLIC_REPO}`}
        issue-term="pathname"
        theme="github-light"
        crossOrigin="anonymous"
        async={true}
      />
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
        .filter(
          (node) => node.path?.endsWith('.md') || node.path?.endsWith('.MD'),
        )
        .map((node) => ({
          params: { path: node.path!.split('/') },
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
  const content = await octokit.rest.repos.getContent({
    owner: process.env.NEXT_PUBLIC_OWNER,
    repo: process.env.NEXT_PUBLIC_REPO,
    path:
      context.params.path?.join('/') ||
      process.env.NEXT_PUBLIC_INDEX ||
      'README.md',
  })
  return {
    props: {
      data:
        'content' in content.data
          ? Buffer.from(content.data.content, 'base64').toString()
          : undefined,
    },
  }
}
