import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsconfigPaths(), // Permet à Vitest de comprendre les imports 'src/...' de NestJS
    swc.vite({
      module: { type: 'es6' }, // Permet à Vitest de compiler les décorateurs NestJS (@Injectable, etc.)
    }),
  ],
});
