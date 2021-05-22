import { css } from '@linaria/core'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'

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
    <div
      className={css`
        .utterances {
          max-width: 900px;
        }
      `}>
      <MarkdownRender
        className={css`
          margin: 64px auto 16px;
          border: solid 1px #e1e4e8;
          border-radius: 6px;
          max-width: calc(900px - 32px - 32px - 1px - 1px);
          padding: 0 32px 16px 32px;
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
    </div>
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
