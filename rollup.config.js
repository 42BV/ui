import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';
import { visualizer } from 'rollup-plugin-visualizer';

import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

const pkg = require('./package.json');

/**
 * TODO: Figure out how to a proper glob copy per
 * https://github.com/gulpjs/gulp/blob/master/docs/recipes/maintain-directory-structure-while-globbing.md
 */
const defaultFormat = (match, src, dest) => {
  const formattedPath = match
    .split(path.sep)
    .filter((dir) => !src.split(path.sep).includes(dir))
    .join(path.sep);

  return path.join(dest, formattedPath);
};

/**
 * Copies files and retains their directory structure
 */
const copy = (options = {}) => {
  const { hook = 'buildEnd', targets = [], format } = options;
  let copied = false;
  let copyTargets = [];

  return {
    name: 'copy',
    [hook]: async () => {
      if (copied) {
        return;
      }

      for (const { src, dest } of targets) {
        glob(src, async (err, matches) => {
          if (err) console.error(err);
          const formattedMatches = matches.map((match) => ({
            src: match,
            dest:
              format && typeof format === 'function'
                ? format(match, src, dest)
                : defaultFormat(match, src, dest)
          }));

          copyTargets.push(...formattedMatches);

          // Copy files
          for (const { src, dest } of copyTargets) {
            await fs.copy(src, dest);
          }
        });
      }

      copied = true;
    }
  };
};

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    autoExternal(),
    copy({
      targets: [
        {
          src: 'src/**/*.scss',
          dest: 'dist'
        }
      ]
    }),
    typescript(),
    visualizer()
  ]
};
