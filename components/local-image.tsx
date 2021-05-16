/* eslint-disable react/jsx-props-no-spreading */

import { Octokit } from 'octokit'
import { ComponentProps } from 'rehype-react'
import useSWR from 'swr'

import { LINE_LABEL } from '../libs/constants'

const octokit = new Octokit({
  auth: process.env.PAT,
})

export default function LocalImage(
  props: ComponentProps & {
    alt?: string
    src?: string
    [LINE_LABEL]?: number
  },
) {
  const { data } = useSWR(
    props.src ? ['image', props.src] : null,
    async () => {
      if (props.src!.startsWith('http') || props.src!.startsWith('//')) {
        return props.src
      }
      const content = await octokit.rest.repos.getContent({
        owner: 'RenzHoly',
        repo: 'Mongood',
        path: props.src!.replace(/^\.\//, '/'),
      })
      return 'download_url' in content.data
        ? content.data.download_url || undefined
        : props.src
    },
    { shouldRetryOnError: false, revalidateOnFocus: false },
  )

  return <img {...props} alt={props.alt} src={data} />
}
