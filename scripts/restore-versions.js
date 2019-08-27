/**
 * Restore versions to their published version. Basically the opposite
 * of the `rewrite-version.js` script.
 */

console.log('Restoring versions after dev publish');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const process = require('process');

// Find all package.json's in the packages directory.
const packages = glob.sync('packages/**/package.json');

// Read in the old versions.
const versionStore = require(path.join(process.cwd(), '.versions.json'));

// Now rewrite each package and restore the version, and dependencies.
packages.forEach(p => {
  const pkg = require(path.join(process.cwd(), p));
  pkg.version = versionStore[pkg.name];

  if (pkg.dependencies) {
    const keys = Object.keys(pkg.dependencies);

    keys.forEach(k => {
      if (versionStore[k]) {
        pkg.dependencies[k] = versionStore[pkg.name];
      }
    });
  }

  fs.writeFileSync(
    path.join(process.cwd(), p),
    JSON.stringify(pkg, undefined, 2)
  );
});

console.log('Finished restoring versions after dev publish');