---
layout: default
title: Directory structure
description: 'Directory structure of @42.nl/ui.'
permalink: /directory-structure
nav_order: 2
---

The top-level directory structure for `@42.nl/ui` looks like the following diagram:

```
@42.nl/ui
├─ docs ············· Project documentation
  └─ storybook ······ Storybook (dist)
├─ scripts ·········· Helpful scripts
├─ storybook ········ Storybook configuration
└─ src ·············· Public packages
  ├─ core ··········· Core components
  ├─ config ········· Contains configuration setup function
  ├─ hooks ···········Hooks
  ├─ form ··········· Form components
  ├─ styling ········ SCSS files
  ├─ table ·········· Table components
  ├─ test ··········· Test fixtures and utilities
  ├─ utilities ······ Utility components and functions (such as translation)
  ├─ index.ts ······· Main export file
  └─ main.scss ······ Main styling file
├─ package.json ····· Project config
└─ rollup.config.js · Rollup config
```
