---
layout: guide
title: Creating a new component
description: 'Creating a new component within @42.nl/ui.'
permalink: /creating-component
nav_order: 3
previous:
  url: directory-structure
  name: Directory structure
next:
  url: component-checklist
  name: Component checklist
---

> Within this documentation the text `<DOMAIN>` will be referred to as being the appropriate package domain in which the component has been created (e.g. `core`, `form`), and the `<COMPONENT>` will be referred to as the name of the component.

## Configuration

It is recommended you start out by copying an existing package: <br />
`cp -r packages/core/Avatar packages/<DOMAIN>/<COMPONENT>`

The next step is modifying the `package.json` to reflect our new component. <br />Navigate to your component:
`cd packages/<DOMAIN>/<COMPONENT>` and modify the relevant parts of the `package.json`, as demonstrated in the following code snippet:

```json
{
  "name": "@42.nl/ui-<DOMAIN>-<COMPONENT>",
  "version": "1.0.0",
  "description": "A description that perfectly describes the component' functionality",
  "main": "lib/<COMPONENT>.js",
  "types": "lib/<COMPONENT>.d.ts",
  "keywords": ["ui", "react", "bootstrap", "<COMPONENT>"],
  "repository": {
    "directory": "packages/core/<COMPONENT>"
  }
}
```

## Development

One of the features is the ability to develop components in isolation. This is done by running `yarn dev` which will spin up a [Storybook](https://storybook.js.org/) instance specific for the component, ensuring any changes to the code will be visible immediately.

<figure align="center">
  <img src="{{site.baseurl}}/assets/img/isolated-storybook.png" alt="Isolated Storybook environment">
  <figcaption>Example of the isolated environment for the Avatar component.</figcaption>
</figure>

### TypeScript

The components are written in [TypeScript](https://www.typescriptlang.org/). This enables us to write code that is less error-prone by statically typechecking our code.

### Sass

The components are styled using [sass](https://sass-lang.com). Within the `<COMPONENT>.scss` you will find two imports in particular:

```
├─ ~@42.nl/ui-core-styling/lib/variables
├─ ~@42.nl/ui-core-styling/lib/bootstrap
```

These imports are mandatory for any component as they provide the opinionated overwrites and variables for `@42.nl/ui` and the various utilities provided by [Bootstrap](https://getbootstrap.com/). This enables you to use the mixins, functions, variables and classes provided by Bootstrap.

The available imports are however not limited to these two dependencies. If you desire the use of, for example, icons, you can make use of `~@42.nl/ui-core-styling/lib/icons`. Be sure to check out `packages/core/_styling` to view a full list of what is available.

> The comments `@remove-on-build-start` and `@remove-on-build-end` are used to indicate that certain dependencies should be stripped during the build phase. These dependencies are required when developing the component in isolation, but are excluded when bundling the various components within `_bundle`, as this already includes the themed styling.

## Testing

Next up is modifying the existing test-cases with our own. Within `@42.nl/ui` we strive for 100% test coverage.

## Bundling

In order for your component to be used by a consumer of the `@42.nl/ui` library it is recommended that you include your component within the `packages/<DOMAIN>/_bundle` directory.

1. Expose your component by re-exporting it from `_bundle/index.ts`: <br />
   `export { default as <COMPONENT> } from '@42.nl/ui-<DOMAIN>-<COMPONENT>';`

2. Include your component' styling by including it in `_bundle/main.scss`: <br />
   `@import '~@42.nl/ui-<DOMAIN>-<COMPONENT>/lib/scss/<COMPONENT>'`;
