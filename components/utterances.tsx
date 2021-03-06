import { css } from '@emotion/css'
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
    script.setAttribute('repo', process.env.NEXT_PUBLIC_REPOSITORY!)
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
        border-top: 1px solid #e1e4e8;
        padding: 16px;
        min-height: 270px;
        .utterances {
          max-width: var(--max-width);
        }
      `}
    />
  )
}
