import { ReactNode, useMemo } from 'react'

import { preview } from '../themes/github'
import { process } from '../libs/markdown'

export default function MarkdownRender(props: { children?: string }) {
  const markdown = useMemo<ReactNode>(
    () =>
      props.children
        ? process(Buffer.from(props.children, 'base64').toString())
        : null,
    [props.children],
  )

  return <article className={preview}>{markdown}</article>
}
