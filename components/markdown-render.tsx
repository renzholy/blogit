import { ReactNode, useMemo } from 'react'
import { cx } from '@linaria/core'
import { preview } from 'themes/github'
import { process } from 'libs/markdown'

export default function MarkdownRender(props: {
  className?: string
  children?: string
}) {
  const markdown = useMemo<ReactNode>(
    () => (props.children ? process(props.children) : null),
    [props.children],
  )

  return <article className={cx(preview, props.className)}>{markdown}</article>
}
