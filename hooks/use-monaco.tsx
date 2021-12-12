import { useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'
import IDLE from 'monaco-themes/themes/IDLE.json'
import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'

export function useMonacoColor() {
  const monaco = useMonaco()
  useEffect(() => {
    if (!monaco) {
      return
    }
    monaco.editor.defineTheme('IDLE', IDLE as editor.IStandaloneThemeData)
    monaco.editor.setTheme('IDLE')
  }, [monaco])
  return monaco?.editor.colorize
}
