/* eslint-disable react/jsx-props-no-spreading */

import { Octokit } from 'octokit'
import { useCallback, useState } from 'react'
import { ComponentProps } from 'rehype-react'
import useSWR from 'swr'

import { LINE_LABEL } from '../libs/constants'

const octokit = new Octokit()

export default function LocalImage(
  props: ComponentProps & {
    alt?: string
    src?: string
    [LINE_LABEL]?: number
  },
) {
  const { data } = useSWR(props.src ? ['image', props.src] : null, () =>
    octokit.rest.repos.getContent({
      owner: 'RenzHoly',
      repo: 'Mongood',
      path: props.src!,
    }),
  )
  const base64 = data && 'content' in data.data ? data.data.content : undefined
  const [label, setLabel] = useState<number>()
  // for MutationObserver attributes
  const handleLoad = useCallback(() => {
    setLabel(props[LINE_LABEL])
  }, [props])

  return (
    <img
      {...(label === undefined
        ? {}
        : {
            [LINE_LABEL]: label,
          })}
      alt={props.alt}
      src={base64 ? `data:image;base64,${base64}` : props.src}
      onLoad={handleLoad}
    />
  )
}
