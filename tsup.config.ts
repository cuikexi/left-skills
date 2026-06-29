import { defineConfig } from 'tsup';

// 单文件 bundle:打包所有依赖进单 .js,无 node_modules,随 skill 生态分发
export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  platform: 'node',
  bundle: true,
  noExternal: [/.*/],
});
