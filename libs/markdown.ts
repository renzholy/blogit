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
import type { H } from 'mdast-util-to-hast'
import type { Node } from 'unist'

import { position } from './plugins/position'
import { emoji } from './plugins/emoji'
import { LINE_LABEL } from './constants'

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

export function process(value: string): string {
  const { contents } = unified()
    .use(parse)
    .use(slug)
    .use(headings)
    .use(gfm)
    .use(position)
    .use(emoji)
    .use(remark2rehype, { handlers: { html: handleHtml } })
    .use(sanitize, {
      ...defaultSchema,
      clobberPrefix: '',
      attributes: {
        ...defaultSchema.attributes,
        code: ['className'],
        '*': [LINE_LABEL, ...(defaultSchema.attributes?.['*'] || [])],
      },
    } as any)
    .use(stringify)
    .processSync(value)
  return contents as string
}
