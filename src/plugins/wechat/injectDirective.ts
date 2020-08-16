import { DirectiveNode, AttributeNode, NodeTypes, locStub } from '@vue/compiler-dom'

const delimitersWrap = (code: string) => '{{' + code + '}}'

// replace v-if to wx:if
export function injectWxIf(prop: DirectiveNode, options?: any): AttributeNode | undefined {
  const { exp, arg, name, type } = prop
  if (type !== NodeTypes.DIRECTIVE) return
  return {
    type: NodeTypes.ATTRIBUTE,
    name: 'if',
    value: {
      content: exp ? delimitersWrap(exp.loc.source) : '',
      type: NodeTypes.TEXT,
      loc: locStub,
    },
    loc: locStub,
  }
}
