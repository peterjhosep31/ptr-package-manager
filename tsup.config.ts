import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    cli: 'CLI/index.ts',
    index: 'index.ts'
  },
  format: ['esm'],
  target: 'node20',
  clean: true,
  outDir: 'dist',
  minify: true,
  outExtension() {
    return {
      js: '.js',
    }
  },
});
