/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-props-no-spreading */

import { ReactNode } from 'react'
import { ComponentProps } from 'rehype-react'
import Link from 'next/link'

export default function LocalLink(
  props: ComponentProps & {
    children?: ReactNode
    href?: string
  },
) {
  if (
    !props.href ||
    props.href.startsWith('http') ||
    props.href.startsWith('//')
  ) {
    return <a {...props} target="_blank" rel="noreferrer" />
  }
  return (
    <Link href={props.href.replace(/\.md$/, '')} passHref={true}>
      <a {...props} />
    </Link>
  )
}
