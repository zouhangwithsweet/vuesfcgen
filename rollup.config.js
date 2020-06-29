import commonjs from 'rollup-plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
// import path from 'path'

export default [
  // esm module
  {
    input: './src/index.ts',
    output: {
      format: 'esm',
      dir: 'lib'
    },
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'lib/types',
        sourceMap: false,
      }),
      commonjs(),
      resolve(),
    ],
    external: [
      '@vue/compiler-core',
      '@babel/core',
      'postcss',
      'prettier',
      'lodash/cloneDeep'
    ]
  },
]
