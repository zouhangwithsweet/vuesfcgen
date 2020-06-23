import {
  baseParse,
  TemplateChildNode,
  AttributeNode,
  DirectiveNode
} from '@vue/compiler-core'
import { transform, BabelFileResult } from '@babel/core'
import postcss from 'postcss'
import cloneDeep from 'lodash/cloneDeep'

const NORMAL_ATTR = 6
const DIRECTIVE_ATTR = 7

const transformPromise = (sourceCode: string, options: any): Promise<BabelFileResult> => {
  return new Promise((resolve, reject) => {
    transform(sourceCode, options, (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result as BabelFileResult)
    })
  })
}

// babel transform script code
export async function transformScript(ast: TemplateChildNode, options?: any) {
  if ('tag' in ast) {
    if (ast.tag === 'script') {
      const sourceCode = ast.loc.source.replace(/<script.*>|<\/script.*>/g, '')
      let code = ``
      const result: BabelFileResult = await transformPromise(sourceCode, options)
      code += result.code
      return code
    }
  }
  return ``
}

// postcss transform style code
export async function transformStyle(ast: TemplateChildNode, options?: any) {
  if ('tag' in ast) {
    if (ast.tag === 'style') {
      const sourceCode = ast.loc.source.replace(/<style.*>|<\/style.*>/g, '')
      let code = ``
      const result = await postcss([
        require('autoprefixer'),
        require('postcss-pxtorem')({
          rootValue: 100,
          propWhiteList: [],
          minPixelValue: 2,
        }),
      ]).process(sourceCode, { from: undefined })
      code += result.css
      return code
    }
  }
  return ``
}

interface codeGenContext {
  code: string
  push: (code: string) => void
  source: string
  newline: (n?: number) => void
}

// gen template
export function createCodegenContext(ast: TemplateChildNode): codeGenContext {
  const context = {
    code: ``,
    push(code: string) {
      context.code += code
    },
    source: ast.loc.source,
    newline(n = 2) {
      context.push('\n' + ` `.repeat(n))
    }
  }
  return context
}

export function genTemplate(ast: TemplateChildNode) {
  const context = createCodegenContext(ast)
  const { push, newline } = context

  push('<template>')
  newline()

  genHTML(ast, context)

  push('</template>')
  newline()
  return context
}

export function genHTML(ast: TemplateChildNode, context: codeGenContext) {
  const { push, newline } = context
  if ('children' in ast) {
    ast.children.forEach((child: any) => {
      const { tag, isSelfClosing, props } = child
      if (tag) {
        if (isSelfClosing) {
          push(`<${tag}`)
          injectProps(props, context)
          push(`/>`)
          newline()
        } else {
          push(`<${tag}`)
          injectProps(props, context)
          push(`>`)
          if (child.children && child.children.length) {
            genHTML(child, context)
          }
          push(`</${tag}>`)
          newline()
        }
      } else {
        push(child.loc.source)
      }
    })
  }
}

export function genOpenTag(tag:string, context: codeGenContext, tagMap?: {
  [k: string]: string
}) {
  const { push } = context
  if (tagMap) {
    push(`<${tagMap[tag]}>`)
  } else {
    push(`<${tag}>`)
  }
}

export function genEndTag(
  tag:string,
  selfClosing: boolean = false,
  context: codeGenContext,
  tagMap?: {
    [k: string]: string
  }
) {
  const { push, newline } = context
  if (tagMap) {
    selfClosing ? push('</>') : push(`</${tagMap[tag]}>`)
  } else {
    selfClosing ? push('</>') : push(`</${tag}>`)
  }
  newline()
}

export function injectProps(
  props: Array<AttributeNode | DirectiveNode>,
  context: codeGenContext)
{
  const { push } = context
  props.forEach(prop => {
    push(` `)
    const { type, name, loc } = prop
    if (type === NORMAL_ATTR) {
      const value = (prop as AttributeNode).value
      value
        ? push(`${name}="${value.content}"`)
        : push(`${name}`)
    } else if (type === DIRECTIVE_ATTR) {
      push(loc.source)
    } else {
      push(loc.source)
    }
  })
}

// todo
export function genDirectiveAttr(
  node: DirectiveNode,
  context: codeGenContext,
  options?: any)
{
  const { push } = context
  push('')
}

export function createNode(ast: TemplateChildNode, options?: Partial<TemplateChildNode>): TemplateChildNode {
  return {
    ...cloneDeep(ast),
    ...options,
  } as TemplateChildNode
}

export function createProp(
  prop?: AttributeNode | DirectiveNode,
  options?: Partial<
    AttributeNode | DirectiveNode
  >): AttributeNode | DirectiveNode {
  return {
    ...cloneDeep(prop),
    ...options,
  } as AttributeNode | DirectiveNode
}

export * from '@vue/compiler-core'
export {}
