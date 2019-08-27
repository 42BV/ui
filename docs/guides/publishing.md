---
layout: guide
title: Publishing
description: 'Creating a new component within @42.nl/ui.'
permalink: /publishing
nav_order: 5
previous:
  url: component-checklist
  name: Component checklist
---

## Development

To prevent multiple prelease publishes for a single feature, we recommend using
[https://verdaccio.org/](Verdaccio). Verdaccio enables you to spin up
a local NPM registry. This allows us to publish multiple versions for
testing purposes without polluting the version scope.

> We recommend the Docker approach instead of locally installing
> Verdaccio, if you do not want to use Docker, refer to the Verdaccio
> documentation.

To publish to the Verdaccio registry run `yarn dev-publish` this
will spin up Verdaccio and publish all packages as a version
based on the current date. To get out the version look for a line
in the output that looks like this:

`+ @42.nl/ui@2019.7.2182427`.

In this case the version would be `2019.7.2182427`.

You can view the Verdaccio registry here: `http://localhost:4873/`. This should show a list of the available packages upon a successful dev publish.

Next in the `package.json` of the project you want to test the new
version in, change the `@42.nl/ui` version to the version that was
created.

Then install with the Verdaccio registry via:

`npm install --registry http://localhost:4873`.

Now you can test the package locally without a publish to the actual
NPM registry.

## Production

<i>TODO: Include publishing for production</i>
