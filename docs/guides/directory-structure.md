---
layout: guide
title: Directory structure
description: 'Creating a new component within @42.nl/ui.'
permalink: /directory-structure
nav_order: 2
previous:
  url: /
  name: Getting started
next:
  url: creating-component
  name: Creating a new component
---

The top-level directory structure for `@42.nl/ui` looks like the following diagram:

```
@42.nl/ui
└─ docs ············· Project documentation
  └─ storybook ······ Storybook
└─ packages ········· Public packages
  ├─ core ··········· Core components
  ├─ form ··········· Form components
└─ package.json ····· Project config
```

## Per-package structure

```
└─ packages
  └─ core ················· Domain specific
    └─ Avatar
      ├─ lib ·············· Built files
      ├─ examples ········· Package-specific examples
      ├─ node_modules ····· NPM dependencies
      ├─ test ············· Package unit tests
      ├─ src ·············· Package source
      ├─ CHANGELOG.md ····· Entire change history for the package
      ├─ README.md ········ Additional package-specific information
      ├─ tsconfig.json ···· TypeScript configuration
      ├─ jest.config.json · Package-specific test configuration
      └─ package.json ····· NPM package configuration
```

Package names are derived from their domain and component name, therefore the above package' name is `@42.nl/ui-core-avatar`.
