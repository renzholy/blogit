import { createElement, Fragment, ReactNode, useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import rehype2react, { ComponentProps } from 'rehype-react'
import unified from 'unified'
import rehype from 'rehype-parse'
import { useMonacoColor } from 'hooks/use-monaco'

const map: { [key: string]: string } = {
  js: 'javascript',
  ts: 'typescript',
  bash: 'shell',
}

export default function MonaCode(
  props: ComponentProps & {
    children?: [string]
    className?: string
  },
) {
  const language = props.className?.replace('language-', '')
  const colorize = useMonacoColor()
  const value = props.children?.[0]?.replace(/\n$/, '') || ''
  const [code, setCode] = useState<ReactNode>()
  useAsyncEffect(
    async (isMounted) => {
      if (!colorize || !language) {
        return
      }
      const colorized = await colorize(value, map[language] || language, {})
      const { result } = await unified()
        .use(rehype, { fragment: true })
        .use(rehype2react, {
          createElement,
          Fragment,
          components: {
            code: MonaCode,
          },
        })
        .process(colorized)
      if (isMounted()) {
        setCode(result as ReactNode)
      }
    },
    [value, colorize, language],
  )

  return <code>{code || value}</code>
}
