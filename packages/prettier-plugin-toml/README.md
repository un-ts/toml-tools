[![npm](https://img.shields.io/npm/v/prettier-plugin-toml.svg)](https://www.npmjs.com/package/prettier-plugin-toml)

# Prettier Toml Plugin

## WORK IN PROGRESS

This plugin is in **alpha state**.
Please try it out and provide feedback.

## Installation

yarn:

```bash
yarn add --dev prettier  --dev --exact
```

npm:

```bash
npm install prettier prettier-plugin-toml --save-dev --save-exact
```

## Usage

This plugin will be loaded automatically (if installed) by prettier to format files
ending with .toml suffix. Using it is exactly the same as using prettier

- Prettier [CLI usage docs](https://prettier.io/docs/en/cli.html).
- Prettier [API usage docs](https://prettier.io/docs/en/api.html).

## Try it out

See an [example npm package](../../test-packages/test-prettier-plugin-toml)
which uses prettier-plugin-toml.

## How it works

A Prettier plugin must first parse the source code of the target language
into a traversable data structure (Usually an **A**bstract **S**yntax **T**ree)
and then print out that data structure in a "pretty" style.

Prettier-Toml uses a [Toml Parser](../parser) implemented in JavaScript using the
[Chevrotain Parser Building Toolkit for JavaScript](https://github.com/SAP/chevrotain).
What this means is that unlike many other prettier plugins,
prettier-toml has **_no additional runtime pre-requisites_** (e.g: Python executable).
It could even be used inside a browser.

## Contributing

Contributions are very welcome!
See the [top level contribution](../../CONTRIBUTING.md) guide for this mono-repo.
