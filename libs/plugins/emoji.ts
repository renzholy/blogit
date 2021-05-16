import { visit } from 'unist-util-visit'
import emojis from 'node-emoji'
import type { Node } from 'unist'

const RE_EMOJI = /:\+1:|:-1:|:[\w-]+:/g

export function emoji() {
  function getEmoji(match: string) {
    const got = emojis.get(match)
    return got
  }

  function transformer(tree: Node) {
    visit(tree, 'text', (node) => {
      // eslint-disable-next-line no-param-reassign
      node.value = (node.value as string).replace(RE_EMOJI, getEmoji)
    })
  }

  return transformer
}
