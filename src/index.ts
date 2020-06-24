import {
  baseParse,
  TemplateChildNode,
  AttributeNode,
  DirectiveNode,
} from '@vue/compiler-core'
import { transform, BabelFileResult } from '@babel/core'
import postcss from 'postcss'
import prettier from 'prettier'
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
  return context.code
}

export function genHTML(ast: TemplateChildNode, context: codeGenContext) {
  const { push, newline } = context
  if ('children' in ast) {
    ast.children.forEach((child: any) => {
      const { tag, isSelfClosing, props } = child
      if (tag) {
        if (isSelfClosing) {
          genOpenTag(tag, context)
          injectProps(props, context)
          genEndTag(tag, context, true)
        } else {
          genOpenTag(tag, context)
          injectProps(props, context)
          push(`>`)
          if (child.children && child.children.length) {
            genHTML(child, context)
          }
          genEndTag(tag, context, false)
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
    push(`<${tagMap[tag]}`)
  } else {
    push(`<${tag}`)
  }
}

export function genEndTag(
  tag:string,
  context: codeGenContext,
  selfClosing: boolean = false,
  tagMap?: {
    [k: string]: string
  }
) {
  const { push, newline } = context
  if (tagMap) {
    selfClosing ? push('/>') : push(`</${tagMap[tag]}>`)
  } else {
    selfClosing ? push('/>') : push(`</${tag}>`)
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
      genDirectiveAttr(prop as DirectiveNode, context)
    } else {
      push(loc.source)
    }
    context.code = context.code.trim()
  })
}

export function genDirectiveAttr(
  node: DirectiveNode,
  context: codeGenContext,
  options?: Partial<DirectiveNode>)
{
  const { push } = context
  const { name, exp, arg, modifiers} = node
  push('v-')
  push(`${name}`)
  // how to format CompoundExpressionNode 
  if (arg) {
    if ('content' in arg) {
      // isConstant for what?
      const { content, isStatic } = arg
      isStatic ? push(`${content}`) : push(`[${content}]`)
    }
  }
  push(modifiers.map(m => '.' + m).join())
  if (exp) {
    push('=')
    if ('content' in exp) {
      // isConstant for what?
      const { content } = exp
      push(`"${content}"`)
    }
  }
}

export function createNode(ast: TemplateChildNode, options?: Partial<TemplateChildNode>): TemplateChildNode {
  return {
    ...cloneDeep(ast),
    ...options,
  } as TemplateChildNode
}

export function createProp<T = AttributeNode | DirectiveNode>(
  prop?: T,
  options?: Partial<T>): T {
  return {
    ...cloneDeep(prop),
    ...options,
  } as T
}

export function formatCode(code: string) {
  return prettier.format(code, {
    parser: 'vue',
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all",
    "arrowParens": "always"
  })
}

export * from '@vue/compiler-core'
export {}
