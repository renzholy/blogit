import { createElement, Fragment, ReactNode } from 'react'
import unified from 'unified'
import parse from 'remark-parse'
import slug from 'remark-slug'
import headings from 'remark-autolink-headings'
import gfm from 'remark-gfm'
import { defaultSchema } from 'hast-util-sanitize'
import rehype from 'rehype-parse'
import remark2rehype from 'remark-rehype'
import stringify from 'rehype-stringify'
import sanitize from 'rehype-sanitize'
import rehype2react from 'rehype-react'
import type { H } from 'mdast-util-to-hast'
import type { Node } from 'unist'

import { emoji } from './plugins/emoji'
import MonaCode from '../components/mona-code'
import LocalImage from '../components/local-image'
import LocalLink from '../components/local-link'

function handleHtml(_h: H, node: Node) {
  return (
    unified()
      .use(rehype, { fragment: true })
      .parse(node.value as Uint8Array).children as {
      properties: object
    }[]
  ).map((child) => ({
    ...child,
    properties: {
      ...child.properties,
      ...(node.data?.hProperties as object),
    },
  }))
}

export function process(value: string): ReactNode {
  const { result } = unified()
    .use(parse)
    .use(slug)
    .use(headings)
    .use(gfm)
    .use(emoji)
    .use(remark2rehype, { handlers: { html: handleHtml } })
    .use(sanitize, {
      ...defaultSchema,
      clobberPrefix: '',
      attributes: {
        ...defaultSchema.attributes,
        code: ['className'],
      },
    } as any)
    .use(stringify)
    .use(rehype2react, {
      createElement,
      Fragment,
      components: {
        code: MonaCode,
        img: LocalImage,
        a: LocalLink,
      },
    })
    .processSync(value)
  return result as ReactNode
}
