import { css } from '@linaria/core'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useRef } from 'react'

export default function Utterances() {
  const ref = useRef<HTMLSelectElement>(null)
  const router = useRouter()
  useEffect(() => {
    const { current } = ref
    if (!current) {
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
    current.appendChild(script)
    return () => {
      current.childNodes.forEach((child) => current.removeChild(child))
    }
  }, [router.query])

  return (
    <section
      ref={ref}
      className={css`
        user-select: none;
        .utterances {
          max-width: var(--max-width);
        }
      `}
    />
  )
}
