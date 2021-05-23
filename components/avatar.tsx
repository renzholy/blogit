import { css } from '@linaria/core'
import Link from 'next/link'

const SIZE = 32

export default function Avatar() {
  return (
    <Link href="/" passHref={true}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>
        <img
          className={css`
            border-radius: 100%;
            cursor: pointer;
          `}
          width={SIZE}
          height={SIZE}
          src={`https://github.com/${process.env.NEXT_PUBLIC_OWNER}.png?size=${
            SIZE * 4
          }`}
          alt="avatar"
        />
      </a>
    </Link>
  )
}
