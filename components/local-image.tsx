/* eslint-disable react/jsx-props-no-spreading */

import { useRouter } from 'next/dist/client/router'
import { useMemo } from 'react'
import { resolve, dirname } from 'path'

export default function LocalImage(props: { alt?: string; src?: string }) {
  const router = useRouter()
  const path = router.query.path as string[] | undefined
  const src = useMemo(() => {
    if (
      !props.src ||
      props.src.startsWith('http') ||
      props.src.startsWith('//')
    ) {
      return props.src
    }
    if (!process.env.NEXT_PUBLIC_REPOSITORY) {
      return undefined
    }
    return `https://raw.githubusercontent.com/${
      process.env.NEXT_PUBLIC_REPOSITORY
    }/${process.env.NEXT_PUBLIC_REF?.replace(
      /^refs\/(head|tag)s\//,
      '',
    )}${resolve(dirname(`/${path?.join('/') || ''}`), props.src)}`
  }, [path, props.src])

  return <img {...props} alt={props.alt} src={src} />
}
