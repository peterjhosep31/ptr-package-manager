import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['CLI/index.ts'],
  format: ['esm'],
  target: 'node16',
  clean: true,
  outDir: 'dist/cli',
  minify: true,
  outExtension() {
    return {
      js: '.js',
    }
  },
});
