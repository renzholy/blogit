import { css } from '@linaria/core'
import { useEffect, useRef } from 'react'

export default function Utterances() {
  const ref = useRef<HTMLSelectElement>(null)
  useEffect(() => {
    if (!ref.current) {
      return undefined
    }
    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute(
      'repo',
      `${process.env.NEXT_PUBLIC_OWNER}/${process.env.NEXT_PUBLIC_REPO}`,
    )
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('label', 'blog-comment')
    script.setAttribute('theme', 'github-light')
    const { current } = ref
    current.appendChild(script)
    return () => {
      current?.removeChild(script)
    }
  }, [])

  return (
    <section
      ref={ref}
      className={css`
        .utterances {
          margin-top: -32px;
          max-width: 900px;
        }
      `}
    />
  )
}
