import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';

import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';

import { getFiles } from './scripts/buildUtils';

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

module.exports = {
  input: [
    'src/index.ts',
    ...getFiles('./src/config', extensions),
    ...getFiles('./src/core', extensions),
    ...getFiles('./src/form', extensions),
    ...getFiles('./src/hooks', extensions),
    ...getFiles('./src/table', extensions),
    ...getFiles('./src/utilities', extensions)
  ],
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true
  },
  plugins: [
    autoExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json',
      declaration: true,
      declarationDir: 'dist'
    }),
    postcss(),
    terser(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: true
    })
  ]
};
