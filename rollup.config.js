import commonjs from 'rollup-plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const external = [
  '@vue/compiler-core',
  '@babel/core',
  'postcss',
  'prettier',
  'lodash/cloneDeep'
]

const plugins = [
  terser(),
  commonjs(),
  resolve(),
]

const srcInput = './src/index.ts'
const pluginsInput = './src/plugins/wechat/index.ts'

export default [
  // esm
  {
    input: srcInput,
    output: {
      format: 'esm',
      dir: 'lib-module'
    },
    plugins: [
      typescript({
        target: 'ES5',
        declaration: true,
        declarationDir: 'lib-module/types',
        sourceMap: false,
      }),
      ...plugins,
    ],
    external,
  },
  {
    input: pluginsInput,
    output: {
      format: 'esm',
      dir: 'lib-module/plugins/wechat'
    },
    plugins: [
      typescript({
        target: 'ES5',
        sourceMap: false,
      }),
      ...plugins,
    ],
    external,
  },
  // cjs
  {
    input: srcInput,
    output: {
      format: 'cjs',
      dir: 'lib'
    },
    plugins: [
      typescript({
        target: 'ES5',
        declaration: true,
        declarationDir: 'lib/types',
        sourceMap: false,
      }),
      ...plugins,
    ],
    external,
  },
  {
    input: pluginsInput,
    output: {
      format: 'cjs',
      dir: 'lib-module/plugins/wechat'
    },
    plugins: [
      typescript({
        target: 'ES5',
        sourceMap: false,
      }),
      ...plugins,
    ],
    external,
  },
]
