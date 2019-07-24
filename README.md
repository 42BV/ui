<p align="center">
  <a href="https://www.42.nl">
    <img alt="@42.nl/ui" src="https://github.com/42BV/ui/blob/assets/banner.png?raw=true" width="547">
  </a>
</p>

<p align="center">
  Components that are commonly used within 42.nl products.
</p>

<p align="center">
    <a href="https://lerna.js.org/">
        <img alt="Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" />
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

## Features

| Package     | Components     |
| ----------- | -------------- |
| `@42.nl/ui` | ContentState   |
|             | Icon           |
|             | InfoBadge      |
|             | NavigationItem |
|             | MoreOrLess     |
|             | Spinner        |
|             | Flash Message  |

## Contributing

This repository makes heavy use of [`Yarn` workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) functionality, therefore it is mandatory to have `Yarn` installed. If you do not have `Yarn` installed, consult the [installation guide](https://yarnpkg.com/en/docs/install#mac-stable).

### Setup

1. Ensure you have Node.js 10.13+ and Yarn installed.
2. Git clone the repository.
3. From the root of the repository, run `yarn` to install the dependencies required for development. This should automatically build and link the individual packages.

### Development

This project uses [lerna](https://lerna.js.org/) to manage independently versioned packages and enable code sharing. This enables us to run commands on repository level through `lerna run [script]` or on package level through `yarn [script]`.

For example developing a new component:

1. Copy an existing package (e.g. `cp -r packages/Avatar packages/Component`) or use [@lerna/create](https://github.com/lerna/lerna/tree/master/commands/create#readme).
2. Update `package.json` to reflect the new component.
3. Ensure the package works by writing a test and verify by running `yarn test`.
4. (Optional) if you're not using an [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for your editor, run `yarn lint`.

### Testing

First follow the build instructions above. Then to run both the linters and tests, use:

```bash
yarn test-all
```

Or to run them seperately, use:

```bash
yarn lint
```

```bash
yarn test
```
