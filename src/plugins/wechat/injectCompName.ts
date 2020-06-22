import babel, { Visitor } from '@babel/core'
import { hyphenate } from '@vue/shared'

type Babel = typeof babel

// babel plugin
/**
 * 替换 components 配置的 key
 * export default {
 *   componets: {
 *     [InputItem.name]: InputItem
 *   }
 * }
 * ---
 * export default {
 *  componets: {
 *    ['md-input-item']: InputItem
 *  }
 * }
 */
export function injectCompName({types: t}: Babel) {
  const compNameVisitor: Visitor<{
    opts: any
  }> = {
    ExportDefaultDeclaration: {
      enter(path, state) {
        const prefix = state?.opts?.prefix || 'md-'

        if (
          path.parent.type = "Program"
        ) {
          const delcaration = path.node.declaration
          if (delcaration.type === 'ObjectExpression') {
            const propComponents = delcaration.properties.find(
              p => {
                return (
                  p.type === 'ObjectProperty' &&
                  p.key.name === 'components'
                )
              }
            )
            if (
              propComponents &&
              'value' in propComponents &&
              propComponents.value.type === 'ObjectExpression'
            ) {
              const props = propComponents.value.properties.filter(
                p => ('key' in p) && p.key.type === 'MemberExpression'
              )
              // 替换 [Comp.name] -> ['md-comp']
              props.forEach(p => {
                if (('key' in p)) {
                  const _key = t.stringLiteral(
                    prefix + hyphenate(p.key.object.name)
                  )
                  p.key = _key
                }
              })
            }
          }
        }
      }
    }
  }
  
  return {
    visitor: compNameVisitor
  }
}
