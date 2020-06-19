import fs from 'fs'
import path from 'path'
import {
  baseParse, RootNode,
} from '@vue/compiler-core'
import { transformScript, transformStyle } from '../../src/index'
const filePath = path.resolve(__dirname, './Index.vue');

const content = fs.readFileSync(filePath).toString();
const rootNode = baseParse(content);

test('transformScript', () => {
  const scriptNode = rootNode.children.find(_ => 'tag' in _ && _.tag === 'script')
  if (scriptNode) {
      const result = transformScript(scriptNode, { filename: 'file.ts' });
      expect(result).toMatchSnapshot();
  }
  expect(true).toBe(true);
});

// TODO
test.skip('transformStyle', () => {
  const scriptNode = rootNode.children.find(_ => 'tag' in _ && _.tag === 'style')
  if (scriptNode) {
      const result = transformStyle(scriptNode);
      console.log(result);
      expect(true).toBe(true);
  }
  expect(true).toBe(true);
});
