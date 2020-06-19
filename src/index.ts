import {
  baseParse,
  TemplateChildNode,
  AttributeNode,
  DirectiveNode
} from '@vue/compiler-core'
import { transformSync } from '@babel/core'
import cloneDeep from 'lodash/cloneDeep'

const NORMAL_ATTR = 6
const DIRECTIVE_ATTR = 7

// babel transform script code
export function transformScript(ast: TemplateChildNode, options?: any) {
  if ('tag' in ast) {
    if (ast.tag === 'script') {
      const sourceCode = ast.loc.source.replace(/<script.*>|<\/script.*>/g, '')
      let code = ``
      code += transformSync(sourceCode, options)?.code
      return code
    }
  }
  return ``
}

// todo transform style ast
export function transformStyle(ast: TemplateChildNode, options?: any) {
  if ('tag' in ast) {
    if (ast.tag === 'style') {
      return ast.loc.source.replace(/<style.*>|<\/style.*>/g, '')
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

export function injectProps(
  props: Array<AttributeNode | DirectiveNode>,
  context: codeGenContext)
{
  const { push } = context
  props.forEach(prop => {
    push(` `)
    const { type, name, loc } = prop
    const value = (props as any).value
    if (type === NORMAL_ATTR) {
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

export function createNode(ast: TemplateChildNode, options?: Partial<TemplateChildNode>) {
  return {
    ...cloneDeep(ast),
    ...options,
  }
}

export function createProps(
  props?: Array<AttributeNode | DirectiveNode>,
  options?: Partial<
    Array<AttributeNode | DirectiveNode>
  >) {
  return {
    ...cloneDeep(props),
    ...options,
  }
}

export * from '@vue/compiler-core'
export {}
