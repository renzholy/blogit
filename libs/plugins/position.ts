import { visit } from 'unist-util-visit'
import type { Node } from 'unist'

import { LINE_LABEL } from '../constants'

export function position() {
  return function transformer(tree: Node) {
    visit(tree, (node) => {
      if (node.position) {
        // eslint-disable-next-line no-param-reassign
        const data = node.data || (node.data = {})
        const props = (data?.hProperties || (data.hProperties = {})) as {
          [key: string]: unknown
        }
        props[LINE_LABEL] = node.position.start.line
      }
    })
  }
}
