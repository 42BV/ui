---
layout: guide
title: Getting started
permalink: /
has_children: false
nav_order: 1
next:
  url: directory-structure
  name: Directory structure
---

<p>
    <a href="https://lerna.js.org/">
        <img alt="Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" />
    </a>
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

## Yarn

This repository makes heavy use of [`Yarn` workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
functionality, therefore it is mandatory to have `Yarn` installed. If you
do not have `Yarn` installed, consult the [installation guide](https://yarnpkg.com/en/docs/install#mac-stable).

## Lerna

This project uses [lerna](https://lerna.js.org/) to manage independently
versioned packages and enable code sharing. This enables us to run commands
on repository level through `lerna run [script]` or on package level
through `yarn [script]`.

It is recommended to install `lerna` globally through `yarn global add lerna` or `npm i -g lerna`.
