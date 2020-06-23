import {
  ElementNode,
  NodeTypes,
  locStub,
  AttributeNode,
} from '@vue/compiler-core'

export const elementNodeStub: ElementNode = {
  type: 1,
  loc: locStub,
  ns: 0,
  tag: 'h1',
  tagType: 0,
  isSelfClosing: false,
  props: [],
  children: [],
  codegenNode: undefined,
}

export const attributeNodeStub: AttributeNode = {
  type: 6,
  name: 'title',
  loc: locStub,
  value: {
    type: 2,
    content: 'Title',
    loc: locStub,
  }
}

// BUG
export const getElementNodeStub = () => {
  console.log(NodeTypes.ELEMENT)
}
