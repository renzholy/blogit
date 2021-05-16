import { createElement, Fragment, ReactNode, useMemo } from 'react'
import unified from 'unified'
import rehype2react from 'rehype-react'
import rehype from 'rehype-parse'

import { preview } from '../themes/github'
import MonaCode from './mona-code'
import LocalImage from './local-image'
import { process } from '../libs/markdown'

export default function MarkdownRender(props: { children?: string }) {
  const markdown = useMemo<ReactNode>(
    () =>
      props.children
        ? unified()
            .use(rehype, { fragment: true })
            .use(rehype2react, {
              createElement,
              Fragment,
              components: {
                code: MonaCode,
                img: LocalImage,
              },
            })
            .processSync(process(props.children))
        : null,
    [props.children],
  )

  return <article className={preview}>{markdown}</article>
}
