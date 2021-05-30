/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-props-no-spreading */

import { ReactNode } from 'react'
import { ComponentProps } from 'rehype-react'
import Link from 'next/link'
import { css } from '@linaria/core'

export default function LocalLink(
  props: ComponentProps & {
    children?: ReactNode
    href?: string
  },
) {
  if (props.href?.endsWith('.mp4') || props.href?.endsWith('.mov')) {
    return (
      <video
        src={props.href}
        controls={true}
        playsInline={true}
        className={css`
          max-width: 100%;
        `}
      />
    )
  }
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
