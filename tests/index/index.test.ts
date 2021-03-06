import fs from 'fs'
import path from 'path'
import { baseParse, locStub } from '@vue/compiler-dom'
import {
  transformScript,
  transformStyle,
  createCodegenContext,
  injectProps,
  createNode,
  createProp,
  genOpenTag,
  genEndTag,
  genDirectiveAttr,
  formatCode,
  genHTML,
  genTemplate,
} from '../../src/index'
import { elementNodeStub, getElementNodeStub, attributeNodeStub, textNodeStub, directiveNodeStub, interpolationNodeStub } from '../stubs'

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

  const interpolationNode = createNode(interpolationNodeStub)
  const emptyResult2 = await transformScript(interpolationNode, { filename: 'file.ts' })
  expect(emptyResult2).toBe('')

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

  const interpolationNode = createNode(interpolationNodeStub)
  const emptyResult2 = await transformStyle(interpolationNode, { filename: 'file.ts' })
  expect(emptyResult2).toBe('')
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

test('genTemplate', () => {
  const targetNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'template',
  )
  if (targetNode) {
    const code = genTemplate(targetNode)
    expect(code).toMatchSnapshot()
  }
})

test('genHTML', () => {
  const targetNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'template',
  )
  if (targetNode) {
    const context = createCodegenContext(targetNode)
    genHTML(targetNode, context)
    expect(context.code).toMatchSnapshot()

    context.code = ''
    const interpolationNode = createNode(interpolationNodeStub)
    genHTML(interpolationNode, context)
    expect(context.code).toBe('')
  }
})

test('injectProps', () => {
  const node = createNode(elementNodeStub)
  const prop = createProp(attributeNodeStub, { name: 'title', value: {...textNodeStub, content: 'Title'} })
  const propWithoutVal = createProp(attributeNodeStub, { name: 'disabled', value: undefined })
  const propDirective = createProp(directiveNodeStub, { name: 'show', loc: locStub, exp: {
    type: 4,
    content: 'true',
    isStatic: false,
    isConstant: false,
    loc: locStub,
  }})
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

test('genOpenTag', () => {
  const node = createNode(elementNodeStub)
  const context = createCodegenContext(node)
  context.code = ''
  genOpenTag('h1', context)
  expect(context.code).toBe('<h1')
  context.code = ''
  genOpenTag('h1', context, {
    'h1': 'p'
  })
  expect(context.code).toBe('<p')
})

test('genEndTag', () => {
  const node = createNode(elementNodeStub)
  const context = createCodegenContext(node)
  context.code = ''
  genEndTag('h1', context)
  expect(context.code).toBe(`</h1>
  `)
  context.code = ''
  genEndTag('br', context, true)
  expect(context.code).toBe(`/>
  `)
  context.code = ''
  genEndTag('h1', context, false, {
    'h1': 'p'
  })
  expect(context.code).toBe(`</p>
  `)
  context.code = ''
  genEndTag('br', context, true, {
    'br': 'divider'
  })
  expect(context.code).toBe(`/>
  `)
})

test('genDirectiveAttr', () => {
  const propDirective = createProp(directiveNodeStub, {
    name: 'show',
    loc: locStub,
    exp: {
      type: 4,
      content: 'true',
      isStatic: false,
      isConstant: false,
      loc: locStub,
    }})
  const node = createNode(elementNodeStub)
  const context = createCodegenContext(node)
  genDirectiveAttr(propDirective, context)
  expect(context.code).toBe(`v-show="true"`)
})

test('formatCode', () => {
  const result = formatCode(`
    <script lang="ts">
    export default {
      data() {
        return {
          greeting: "Hello"
        }
      },
    }
    </script>
  `);
  expect(result).toMatchSnapshot()
})

// BUG
test.skip('getElementNodeStub', () => {
  getElementNodeStub()
})
