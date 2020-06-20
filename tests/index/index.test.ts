import fs from 'fs'
import path from 'path'
import {
  baseParse,
  RootNode,
  AttributeNode,
  NodeTypes,
  TemplateChildNode,
  DirectiveNode,
} from '@vue/compiler-core'
import {
  transformScript,
  transformStyle,
  createCodegenContext,
  injectProps,
} from '../../src/index'
const filePath = path.resolve(__dirname, './Index.vue')

const content = fs.readFileSync(filePath).toString()
const rootNode = baseParse(content)

test('transformScript', async () => {
  const scriptNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'script',
  )
  if (scriptNode) {
    const result = await transformScript(scriptNode, { filename: 'file.ts' })
    expect(result).toMatchSnapshot()
  }
})

test('transformStyle', async () => {
  const scriptNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'style',
  )
  if (scriptNode) {
    const result = await transformStyle(scriptNode)
    expect(result).toMatchSnapshot()
  }
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
  const templateNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'template',
  )
  if (templateNode) {
    const context = createCodegenContext(templateNode)
    context.push('<p')
    if ('children' in templateNode) {
      templateNode.children.forEach((_: any) => {
        const props: Array<AttributeNode | DirectiveNode> = _.props
        injectProps(props, context)
      })
    }
    context.push('</p>')
    expect(context.code).toMatchSnapshot()
  }
})
