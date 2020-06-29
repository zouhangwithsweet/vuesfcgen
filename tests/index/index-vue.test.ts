import fs from 'fs'
import path from 'path'
import { mount } from '@vue/test-utils'
import Index from './Index.vue'
import { baseParse } from '@vue/compiler-core'
import { transformScript, transformStyle, genTemplate, createCodegenContext, formatCode } from '../../src/index'

test('default', () => {
  const wrapper = mount(Index)
  expect(wrapper.html()).toMatchSnapshot()
})

test('generator', async () => {
  const filePath = path.resolve(__dirname, './Index.vue')
  const content = fs.readFileSync(filePath).toString()
  const rootNode = baseParse(content)

  const scriptNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'script',
  )
  const styleNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'style',
  )
  const templateNode = rootNode.children.find(
    (_) => 'tag' in _ && _.tag === 'template',
  )

  if (!scriptNode || !styleNode || !templateNode) {
    throw new Error('Invalid Nodes')
  }

  const scriptResult = await transformScript(scriptNode, {
    filename: 'file.ts',
  })
  const styleResult = await transformStyle(styleNode)
  const templateResult = await genTemplate(templateNode)

  const context = createCodegenContext()
  context.push(templateResult)
  context.push('<script>')
  context.newline()
  context.push(scriptResult)
  context.newline()
  context.push('</script>')
  context.newline()
  context.push('<style>')
  context.newline()
  context.push(styleResult)
  context.newline()
  context.push('</style>')
  context.code = formatCode(context.code)

  const genFilePath = path.resolve(__dirname, './Index-gen.vue')
  const genComponent = require(genFilePath).default;
  const genWrapper = mount(genComponent)
  expect(genWrapper.html()).toMatchSnapshot()
})
