import fs from 'fs'
import path from 'path'
import {
  baseParse, RootNode,
} from '@vue/compiler-core'
import { transformScript, transformStyle } from '../../src/index'
const filePath = path.resolve(__dirname, './Index.vue');

const content = fs.readFileSync(filePath).toString();
const rootNode = baseParse(content);

test('transformScript', async () => {
  const scriptNode = rootNode.children.find(_ => 'tag' in _ && _.tag === 'script')
  if (scriptNode) {
      const result = await transformScript(scriptNode, { filename: 'file.ts' });
      expect(result).toMatchSnapshot();
  }
  expect(true).toBe(true);
});

test('transformStyle', async () => {
  const scriptNode = rootNode.children.find(_ => 'tag' in _ && _.tag === 'style')
  if (scriptNode) {
      const result = await transformStyle(scriptNode);
      expect(result).toMatchSnapshot();
  }
  expect(true).toBe(true);
});
