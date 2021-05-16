/* eslint-disable react/jsx-props-no-spreading */

import { useMemo } from 'react'
import { ComponentProps } from 'rehype-react'

export default function LocalImage(
  props: ComponentProps & {
    alt?: string
    src?: string
  },
) {
  const src = useMemo(() => {
    if (props.src!.startsWith('http') || props.src!.startsWith('//')) {
      return props.src
    }
    if (!process.env.NEXT_PUBLIC_OWNER || !process.env.NEXT_PUBLIC_REPO) {
      return undefined
    }
    return `https://raw.githubusercontent.com/${
      process.env.NEXT_PUBLIC_OWNER
    }/${process.env.NEXT_PUBLIC_REPO}/${
      process.env.NEXT_PUBLIC_BRANCH
    }${props.src!.replace(/^\.\//, '/')}`
  }, [props.src])

  return <img {...props} alt={props.alt} src={src} />
}
