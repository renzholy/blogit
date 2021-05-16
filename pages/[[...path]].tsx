import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'

import MarkdownRender from '../components/markdown-render'

const octokit = new Octokit()

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
  const ref = await octokit.rest.git.getRef({
    owner: 'RenzHoly',
    repo: 'Mongood',
    ref: 'heads/master',
  })
  const tree = await octokit.rest.git.getTree({
    owner: 'RenzHoly',
    repo: 'Mongood',
    tree_sha: ref.data.object.sha,
    recursive: 'true',
  })
  return {
    paths: tree.data.tree.map((node) => ({
      params: { path: node.path!.split('./') },
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
  const content = await octokit.rest.repos.getContent({
    owner: 'RenzHoly',
    repo: 'Mongood',
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
