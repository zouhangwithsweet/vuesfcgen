import {
  ElementNode,
  NodeTypes,
  locStub,
  AttributeNode,
  TextNode,
  DirectiveNode,
  InterpolationNode,
} from '@vue/compiler-dom'

export const textNodeStub: TextNode = {
  type: 2,
  content: '',
  loc: locStub,
}

export const elementNodeStub: ElementNode = {
  type: 1,
  loc: locStub,
  ns: 0,
  tag: '',
  tagType: 0,
  isSelfClosing: false,
  props: [],
  children: [],
  codegenNode: undefined,
}

export const attributeNodeStub: AttributeNode = {
  type: 6,
  name: '',
  loc: locStub,
  value: textNodeStub,
}

export const directiveNodeStub: DirectiveNode = {
  type: 7,
  name: '',
  loc: locStub,
  exp: undefined,
  arg: undefined,
  modifiers: []
}

export const interpolationNodeStub: InterpolationNode = {
  type: 5,
  loc: locStub,
  content: {
    loc: locStub,
    type: 4,
    content: '',
    isStatic: false,
    isConstant: false,
  }
}

// BUG
export const getElementNodeStub = () => {
  console.log(NodeTypes.ELEMENT)
}
