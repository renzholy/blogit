import { createElement, Fragment, ReactNode } from 'react'
import { unified } from 'unified'
import parse from 'remark-parse'
import slug from 'remark-slug'
import headings from 'remark-autolink-headings'
import gfm from 'remark-gfm'
import { defaultSchema } from 'hast-util-sanitize'
import remark2rehype from 'remark-rehype'
import stringify from 'rehype-stringify'
import sanitize from 'rehype-sanitize'
import rehype2react, { Options } from 'rehype-react'
import MonaCode from 'components/mona-code'
import LocalImage from 'components/local-image'
import LocalLink from 'components/local-link'

export function process(value: string): ReactNode {
  const { result } = unified()
    .use(parse)
    .use(slug)
    .use(headings)
    .use(gfm)
    .use(remark2rehype)
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
    } as Options)
    .processSync(value)
  return result as ReactNode
}
