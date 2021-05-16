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
  path: string[]
}

export default function Path(props: Props) {
  return <MarkdownRender>{props.data}</MarkdownRender>
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
    paths: tree.data.tree
      .filter(
        (node) => node.path?.endsWith('.md') || node.path?.endsWith('.MD'),
      )
      .map((node) => ({
        params: { path: node.path!.split('/') },
      })),
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
    path: context.params.path.join('/'),
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
