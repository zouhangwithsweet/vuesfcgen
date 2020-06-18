import { baseParse, TemplateChildNode } from '@vue/compiler-core'
import { transform } from '@babel/core'

const NORMAL_ATTR = 6

// babel transform script code
function transformScript(ast: TemplateChildNode, options?: any) {
  if ('tag' in ast) {
    if (ast.tag === 'script') {
      const sourceCode = ast.loc.source
      let code = ``
      code += transform(sourceCode, options)
      return code
    }
  }
  return ``
}

// todo transform style ast
function transformStyle(ast: TemplateChildNode, options?: any) {
  if ('tag' in ast) {
    if (ast.tag === 'style') {
      return ast.loc.source
    }
  }
  return ``
}

// gen template
function createCodegenContext(ast: TemplateChildNode) {
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

function genTemplate(ast: TemplateChildNode) {
  const context = createCodegenContext(ast)
  const { push, newline } = context

  push('<template>')
  newline()

  genHTML(ast, context)

  push('</template>')
  newline()
  return context
}

function genHTML(ast: TemplateChildNode, context) {
  const { push, newline } = context
  if ('children' in ast) {
    ast.children.forEach(child => {
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

function injectProps(props, context) {
  const { push } = context
  props.forEach(prop => {
    push(` `)
    const { type, name, value, loc } = prop
    if (type === NORMAL_ATTR) {
      value
        ? push(`${name}=${value.loc.source}`)
        : push(`${name}`)
    } else {
      push(loc.source)
    }
  })
}
