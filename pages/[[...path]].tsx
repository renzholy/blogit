import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'

import MarkdownRender from '../components/markdown-render'

const octokit = new Octokit({
  auth: process.env.PAT,
})

type Props = {
  path: string
  content?: string
  download_url: string | null
}

type Params = {
  path: string[]
}

export default function Path(props: Props) {
  if (props.path.endsWith('.md') || props.path.endsWith('.MD')) {
    return <MarkdownRender>{props.content}</MarkdownRender>
  }
  return props.download_url
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
    paths: tree.data.tree.map((node) => ({
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
    props: content.data as Props,
  }
}
