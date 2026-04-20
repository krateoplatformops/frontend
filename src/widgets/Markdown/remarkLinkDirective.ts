import type { Root } from 'mdast'
import type {
  TextDirective,
  LeafDirective,
  ContainerDirective,
} from 'mdast-util-directive'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

type DirectiveNode = TextDirective | LeafDirective | ContainerDirective

export const remarkLinkDirective: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type !== 'textDirective'
        && node.type !== 'leafDirective'
        && node.type !== 'containerDirective'
      ) {
        return
      }

      const directive = node as DirectiveNode

      if (directive.name !== 'link') { return }

      const data = directive.data ?? (directive.data = {})
      const attributes = directive.attributes ?? {}

      data.hName = 'a'
      data.hProperties = {
        href: attributes.href,
        rel: attributes.rel,
        target: attributes.target,
      }
    })
  }
}
