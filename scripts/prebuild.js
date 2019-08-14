/**
 * Utility command that strips text from files based on the comment `@remove-on-build-start`. For now this is only used
 * to remove certain dependencies within our `scss` files, which we only use for isolated development.
 */
const fs = require('fs');
const process = require('process');
const path = require('path');
const glob = require('glob');

const args = process.argv.slice(2);
const cwd = process.cwd();

const [input, outputDir] = args;

if (!input || !outputDir) {
  console.error('Strip requires the arguments input and output.');
  process.exit(1);
}

if (!fs.existsSync(path.join(cwd, outputDir))) {
  fs.mkdirSync(path.join(cwd, outputDir), { recursive: true });
}

glob(input, (err, files) => {
  if (err) console.error(err);

  files.forEach(file => {
    const filePath = path.join(cwd, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content =
      content
        .replace(
          /\/\/ @remove-on-build-start([\s\S]*?)\/\/ @remove-on-build-end/gm,
          ''
        )
        .trim() + '\n';

    fs.writeFileSync(path.join(cwd, outputDir, path.basename(file)), content);
  });
});
