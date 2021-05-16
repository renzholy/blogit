import { useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'
import IDLE from 'monaco-themes/themes/IDLE.json'
import emojis from 'node-emoji'
import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'

import { id, language, conf } from '../libs/monaco-config'

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

export function useMonacoEditor() {
  const monaco = useMonaco()
  useMonacoColor()
  useEffect(() => {
    if (!monaco) {
      return
    }
    monaco.languages.register({ id })
  }, [monaco])
  useEffect(() => {
    if (!monaco) {
      return undefined
    }
    const { dispose } = monaco.languages.setLanguageConfiguration(id, conf)
    return dispose
  }, [monaco])
  useEffect(() => {
    if (!monaco) {
      return undefined
    }
    const { dispose } = monaco.languages.setMonarchTokensProvider(id, language)
    return dispose
  }, [monaco])
  useEffect(() => {
    if (!monaco) {
      return undefined
    }
    const { dispose } = monaco.languages.registerCompletionItemProvider(id, {
      triggerCharacters: [':'],
      provideCompletionItems(model, position, context) {
        if (context.triggerKind === 0) {
          return {
            suggestions: [],
          }
        }
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        return {
          suggestions: emojis.search(word.word).map((e) => ({
            label: `${e.key} ${e.emoji}`,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `${e.key}:`,
            range,
          })),
        }
      },
    })
    return dispose
  }, [monaco])
  return monaco
}
