import { css, cx } from '@linaria/core'
import Link from 'next/link'

export default function Navigation(props: { className?: string }) {
  const links =
    process.env.NEXT_PUBLIC_LINKS?.split(';').map((item) => item.split(',')) ||
    []

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
      )}>
      {links
        .filter(
          ([, link]) => !link.startsWith('http') && !link.startsWith('//'),
        )
        .map(([name, href]) => (
          <Link
            key={name}
            href={href === process.env.NEXT_PUBLIC_INDEX ? '/' : href}>
            {name}
          </Link>
        ))}
      <div
        className={css`
          flex: 1;
        `}
      />
      {links
        .filter(([, link]) => link.startsWith('http') || link.startsWith('//'))
        .map(([name, href]) => (
          <a key={name} href={href} target="_blank" rel="noreferrer">
            {name}
          </a>
        ))}
    </nav>
  )
}
