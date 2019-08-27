---
layout: guide
title: Component checklist
description: 'Checklist for completing a component @42.nl/ui.'
permalink: /component-checklist
nav_order: 4
previous:
  url: creating-component
  name: Creating a new component
next:
  url: publishing
  name: Publishing
---

The newly created component has:

- A `package.json` that has the following modified fields:
  - [ ] Name
  - [ ] Version
  - [ ] Description
  - [ ] Main
  - [ ] Types
  - [ ] Keywords
  - [ ] Repository
  - [ ] Appropriate `devDependencies`
  - [ ] Appropriate `dependencies`
  - [ ] Appropriate `peerDependencies`
- Test(s) that have at least:
  - [ ] Visually verified output (through `yarn dev`)
  - [ ] 100% coverage
- Styling that has:
  - [ ] The appropriate dependencies
- Been included in the `_bundle` for both:

  - [ ] Styling
  - [ ] Functionality

- Been globally tested:
  - [ ] By running `yarn test` from the root directory
