import fs from 'fs'
import path from 'path'
import { baseParse, locStub } from '@vue/compiler-core'
import {
  transformScript,
  transformStyle,
  createCodegenContext,
  injectProps,
  createNode,
  createProp,
} from '../../src/index'
import { elementNodeStub, getElementNodeStub, attributeNodeStub, textNodeStub, directiveNodeStub } from '../stubs'

const filePath = path.resolve(__dirname, './Index.vue')

const content = fs.readFileSync(filePath).toString()
const rootNode = baseParse(content)

test('transformScript', async () => {
  const targetNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'script',
  )

  if (targetNode) {
    const result = await transformScript(targetNode, { filename: 'file.ts' })
    expect(result).toMatchSnapshot()
  }

  const otherNode = createNode(elementNodeStub)
  const emptyResult = await transformScript(otherNode, { filename: 'file.ts' })
  expect(emptyResult).toBe('')

  try {
    const errorNode = createNode(elementNodeStub, {
      tag: 'script'
    })
    await transformScript(errorNode)
  } catch (error) {
    expect(emptyResult).toMatchSnapshot()
  }
})

test('transformStyle', async () => {
  const targetNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'style',
  )

  if (targetNode) {
    const result = await transformStyle(targetNode)
    expect(result).toMatchSnapshot()
  }

  const otherNode = createNode(elementNodeStub)
  const emptyResult = await transformStyle(otherNode, { filename: 'file.ts' })
  expect(emptyResult).toBe('')
})

test('createCodegenContext', () => {
  const templateNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'template',
  )
  if (templateNode) {
    const context = createCodegenContext(templateNode)
    expect(context.code).toBe('')
    expect(context.source).toBe(templateNode.loc.source)
    context.push('<template>')
    context.newline()
    context.push('<h1>Hello</h1>')
    context.newline(2)
    context.push('</template>')
    context.newline(4)
    expect(context.code).toMatchSnapshot()
  }
})

test('injectProps', () => {
  const node = createNode(elementNodeStub)
  const prop = createProp(attributeNodeStub, { name: 'title', value: {...textNodeStub, content: 'Title'} })
  const propWithoutVal = createProp(attributeNodeStub, { name: 'disabled', value: undefined })
  const propDirective = createProp(directiveNodeStub, { name: 'v-show', loc: { ...locStub, source: `v-show="true"` } })
  const propUnSupportType = createProp(attributeNodeStub, { type: 0 })
  const context = createCodegenContext(node)
  context.push('<p')
  injectProps([prop, propWithoutVal, propDirective, propUnSupportType], context)
  context.push('>')
  context.push('</p>')
  expect(context.code).toMatchSnapshot()
})

test('createNode', () => {
  const node = createNode(elementNodeStub)
  expect(node).toMatchSnapshot()
})

test('createProp', () => {
  const prop = createProp(attributeNodeStub)
  expect(prop).toMatchSnapshot()
})

// BUG
test.skip('getElementNodeStub', () => {
  getElementNodeStub()
})
