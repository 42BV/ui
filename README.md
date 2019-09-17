<p align="center">
  <a href="https://www.42.nl">
    <img alt="@42.nl/ui" src="https://github.com/42BV/ui/blob/assets/banner.png?raw=true" width="547">
  </a>
</p>

<p align="center">
  Components that are commonly used within 42.nl products.
</p>

<p align="center">
    <a href="https://travis-ci.org/42BV/ui/">
      <img alt="Build status" src="https://travis-ci.org/42BV/ui.svg?branch=master" />
    </a>
    <a href="https://codecov.io/gh/42BV/ui">
      <img alt="Coverage" src="https://codecov.io/gh/42BV/ui/branch/master/graph/badge.svg" />
    </a>
    <a href="https://greenkeeper.io/">
      <img alt="Greenkeeper" src="https://badges.greenkeeper.io/42BV/ui.svg" />
    </a>
</p>

---

## Installation

### Setup

```bash
# with yarn
yarn add @42.nl/ui

# with npm
npm i @42.nl/ui --save
```

## Contributing

> Detailled steps can be found at https://42bv.github.io/ui.

### Setup

1. Ensure you have Node.js 10.13+ and Yarn installed.
2. Git clone the repository.
3. From the root of the repository, run `yarn` to install the dependencies required for development.

### Testing

First follow the build instructions above. Then to run both the linters and tests, use:

```bash
npm run test-all
```

Or to run them seperately, use:

```bash
npm run lint
```

```bash
npm run test
```

#### Development

To prevent multiple prelease publishes for a single feature, we recommend using
[https://verdaccio.org/](Verdaccio). Verdaccio enables you to spin up
a local NPM registry which in turn allows us to publish multiple versions for testing purposes without polluting the version in NPM.

> We recommend the Docker approach instead of locally installing
> Verdaccio, if you do not want to use Docker, refer to the Verdaccio
> documentation.

To publish to the Verdaccio registry run `npm run dev:publish` this
will spin up Verdaccio and publish.

You can view Verdaccio here: `http://localhost:4873/` it should after
a successful dev publish show the packages here.

To verify the release, install `@42.nl/ui` from the Verdaccio registry in a project of your choice
by running: `npm install --registry http://localhost:4873`.

Now you can test the package locally without a publish to the actual
NPM registry.
