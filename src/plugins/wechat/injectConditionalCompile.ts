import babel, { Visitor } from '@babel/core'

type Babel = typeof babel

// babel plugin
export function injectConditionalCompile({ types: t}: Babel) {
  return {
    vistor: {}
  }
}
