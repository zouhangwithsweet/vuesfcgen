import { AttributeNode, NodeTypes, locStub } from '@vue/compiler-dom'

export function injectImgMode(options: {
  [k: string]: string
} = {
  mode: 'withFix'
}): AttributeNode[] {
  return Object.keys(options).map(k => ({
    name: k,
    type: NodeTypes.ATTRIBUTE,
    loc: locStub,
    value: {
      content: options[k],
      loc: locStub,
      type: NodeTypes.TEXT,
    }
  }))
}
