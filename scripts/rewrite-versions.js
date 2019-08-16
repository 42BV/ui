/**
 * Modify package versions to `42.0.0` for local development purposes.
 * This enables us to publish packages to verdaccio without having 
 * the checks of Lerna `version` command.
 *
 * It creates a list of the old package versions so it can be reset 
 * by the `reset-version` script after the packages are locally 
 * published.
 * 
 * The old package versions will be stored in a file called .versions
 * which is ignored by git.
 * 
 * The `restore-version.js` script restores the versions again.
 */

console.log('Re-writing versions for dev publish');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const process = require('process');

// Generate version based on the date to bust caches.
const now = new Date();

// This is the 'fake' version all packages will get.
const VERSION = `${now.getFullYear()}.${now.getMonth()}.${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

// We store the name of the package as the key, and the version as
// the value.l
const versionStore = {};

// Find all package.json's in the packages directory.
const packages = glob.sync('packages/**/package.json');

// In the first loop store the version and set the new fake version
packages.forEach(p => {
  const pkg = require(path.join(process.cwd(), p));
  versionStore[pkg.name] = pkg.version;
  pkg.version = VERSION;

  fs.writeFileSync(
    path.join(process.cwd(), p),
    JSON.stringify(pkg, undefined, 2)
  );
});

// In this loop rewrite all dependencies to the new fake version.
packages.forEach(p => {
  const pkg = require(path.join(process.cwd(), p));

  if (pkg.dependencies) {
    const keys = Object.keys(pkg.dependencies);

    keys.forEach(k => {
      if (versionStore[k]) {
        pkg.dependencies[k] = VERSION;
      }
    });
  }

  fs.writeFileSync(
    path.join(process.cwd(), p),
    JSON.stringify(pkg, undefined, 2)
  );
});

// Make the versions pretty and write them to the json.
const oldVersions = JSON.stringify(versionStore, undefined, 2);
fs.writeFileSync('.versions.json', oldVersions);

console.log('Finished re-writing versions for dev publish');
