import type { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export type Props = {
  lastModified: string | null
  data: string | null
  pathname: string | null
}

export type Params = {
  path?: string[]
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
