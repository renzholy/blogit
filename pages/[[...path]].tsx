import { css } from '@linaria/core'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'
import Link from 'next/link'

import MarkdownRender from '../components/markdown-render'

const octokit = new Octokit({
  auth: process.env.GHP,
})

type Props = {
  lastModified?: string
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
          padding: 0 32px;
          & a {
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            margin-left: 16px;
          }
          & a:hover,
          a:focus {
            color: hsla(0, 0%, 100%, 0.7);
          }
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
        <Link href="/">Home</Link>
        <Link href={`/${process.env.NEXT_PUBLIC_ABOUT}`}>About</Link>
        <div
          className={css`
            flex: 1;
          `}
        />
        {process.env.NEXT_PUBLIC_LINKS?.split(';')
          .map((item) => item.split(','))
          .map(([title, link]) => (
            <a key={title} href={link} target="_blank" rel="noreferrer">
              {title}
            </a>
          ))}
      </nav>
      <div
        className={css`
          margin: 78px auto 16px;
          max-width: 900px;
          padding: 0 32px;
        `}>
        <MarkdownRender
          className={css`
            padding: 0;
          `}>
          {props.data}
        </MarkdownRender>
        <footer
          className={css`
            border-top: 1px solid #eaecef;
            padding-top: 16px;
            font-size: 12px;
            color: #6a737d;
            display: flex;
            justify-content: flex-end;
          `}>
          Last Modified:&nbsp;
          <time title={props.lastModified}>
            {dayjs(props.lastModified).format('YYYY-MM-DD')}
          </time>
        </footer>
      </div>
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
  const content = await octokit.rest.repos.getContent({
    owner: process.env.NEXT_PUBLIC_OWNER,
    repo: process.env.NEXT_PUBLIC_REPO,
    path: `${
      context.params.path?.join('/') ||
      process.env.NEXT_PUBLIC_INDEX ||
      'README'
    }.md`,
  })
  return {
    props: {
      lastModified: content.headers['last-modified'],
      data:
        'content' in content.data
          ? Buffer.from(content.data.content, 'base64').toString()
          : undefined,
    },
  }
}
