import { css } from '@linaria/core'
import { ReactNode } from 'react'

import Navigation from './navigation'

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      <Navigation
        className={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background-color: #24292e;
          padding: 0 32px;
        `}
      />
      {props.children}
    </>
  )
}
