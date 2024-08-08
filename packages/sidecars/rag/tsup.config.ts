import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: true,
  clean: true,
  treeshake: true,
  format: ['esm'],
  minify: true,
})
