import { css, cx } from '@emotion/css'
import Link from 'next/link'
import { useMemo } from 'react'

export default function Navigation(props: { className?: string }) {
  const headers = useMemo(
    () =>
      process.env.NEXT_PUBLIC_HEADER?.split(';').map((item) =>
        item.split(','),
      ) || [],
    [],
  )

  return (
    <nav
      className={cx(
        props.className,
        css`
          user-select: none;
          display: flex;
          align-items: center;
          a {
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
          }
          a + a {
            margin-left: 16px;
          }
          a:hover,
          a:focus {
            color: hsla(0, 0%, 100%, 0.7);
          }
        `,
      )}
    >
      <Link href="/">{process.env.NEXT_PUBLIC_TITLE}</Link>
      <div
        className={css`
          flex: 1;
        `}
      />
      {headers.map(([name, href]) =>
        href.startsWith('http') || href.startsWith('//') ? (
          <a key={name} href={href} target="_blank" rel="noreferrer">
            {name}
          </a>
        ) : (
          <Link key={name} href={href}>
            {name}
          </Link>
        ),
      )}
    </nav>
  )
}
