import { css } from '@linaria/core'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import dayjs from 'dayjs'
import Link from 'next/link'
import Head from 'next/head'
import { useMemo } from 'react'

import MarkdownRender from '../components/markdown-render'
import Utterances from '../components/utterances'

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
  const links =
    process.env.NEXT_PUBLIC_LINKS?.split(';').map((item) => item.split(',')) ||
    []
  const title = useMemo(() => props.data?.match(/# (.+)/)?.[1], [props.data])

  if (!props.data) {
    return null
  }
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className={css`
          margin: 78px auto 16px;
          max-width: 900px;
          padding: 0 32px;
        `}>
        <nav
          className={css`
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
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
          {links
            .filter(
              ([, link]) => !link.startsWith('http') && !link.startsWith('//'),
            )
            .map(([name, href]) => (
              <Link
                key={name}
                href={href === process.env.NEXT_PUBLIC_INDEX ? '/' : href}>
                {name}
              </Link>
            ))}
          <div
            className={css`
              flex: 1;
            `}
          />
          {links
            .filter(
              ([, link]) => link.startsWith('http') || link.startsWith('//'),
            )
            .map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer">
                {name}
              </a>
            ))}
        </nav>
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
      lastModified: content.headers['last-modified'] || null,
      data:
        'content' in content.data
          ? Buffer.from(content.data.content, 'base64').toString()
          : null,
    },
  }
}
