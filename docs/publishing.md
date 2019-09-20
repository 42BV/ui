---
layout: default
title: Publishing
description: 'Creating a new component within @42.nl/ui.'
permalink: /publishing
nav_order: 5
---

## Development

To prevent multiple prelease publishes for a single feature, we recommend using
[https://verdaccio.org/](Verdaccio). Verdaccio enables you to spin up
a local NPM registry which in turn allows us to publish multiple versions for testing purposes without polluting the version in NPM.

> We recommend the Docker approach instead of locally installing
> Verdaccio, if you do not want to use Docker, refer to the Verdaccio
> documentation.

To publish to the Verdaccio registry run `npm run dev:publish` this will spin up Verdaccio and attempt to publish our new version. If this succeeds, Verdaccio will be accessable through a web interface via `http://localhost:4873/`. If everything is correct it should show a list of published packages.

### Verifying

To verify the release, install `@42.nl/ui` from the Verdaccio registry in a project of your choice by running:

`npm install --registry http://localhost:4873`.

Now you can test the package locally without a publish to the actual NPM registry.

> <b>Note:</b> do not forget to re-install the package from NPM and rebuilding your respective `package-lock.json` upon releasing a new version of the library, otherwise the installation of the package in production will result in an error.

## Production

Drafting a new release is as simple as running `npm run release`. This command runs (https://github.com/sindresorhus/np)[np] under the hood, which will guide you through the process of drafting a release.
