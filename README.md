[![Build Status](https://travis-ci.org/bd82/toml-tools.svg?branch=master)](https://travis-ci.org/bd82/toml-tools)
[![LICENSE](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/bd82/toml-tools/master/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# TOML-Tools

** This project is currently un-maintained and looking for a new maintainer **

- See: relevant [issue](https://github.com/bd82/toml-tools/issues/43)

## Introduction

This [mono-repo][mono-repo] contains a **_set of tools for working with the [Toml][toml] configuration file format_**.

## Why

The common Toml related tooling are Toml -> Json compilers.
But compiling to Json is just one scenario of many,
lets consider some other potential use cases:

- **Building a Toml Syntax Highlighter**.
- **Converting Toml to Yaml**.
- **Building a Toml Beautifier**.
- **Validating Toml versus a given schema**.
- **Providing content assist in a Toml file**.

These scenarios cannot be implemented (well) using
most existing Toml to Json compilers, for example:

- **Lost comments information**.
  - How can we beautify or convert Toml to Yaml if we don't possess the comments information?
- **Lack of Token type & positioning information.**
  - How could we syntax highlight(paint) parts of a Toml file if we do not know
    where every single Token starts and ends (Commas/Parenthesis/Literals/...)?
- **Failing on the first error**
  - How would we implement content assist on a Toml file currently being edited
    if our parser fails on the first error?
- **Lack of full position information**
  - How will we provide useful Schema validation errors if we lack full position information?
  - Full position information would also be needed for the content assist scenario.

## How

This mono repo will contain two types of packages.

- Low level **Infrastructure** (Toml Lexer & Parser implemented using [Chevrotain][chevrotain])
  with advanced capabilities to support the complex scenarios described above.
- Toml (end user) **Tooling** (Beautifier/Compiler/Schema Validator/...) that would be implemented using
  the advanced low level infrastructure packages mentioned above.

## Status (Alpha)

Infrastructure packages:

- [@toml-tools/lexer](./packages/lexer)
- [@toml-tools/parser](./packages/parser)

Tooling Packages:

- [prettier-plugin-toml](./packages/prettier-plugin-toml)

[toml]: https://github.com/toml-lang/toml
[mono-repo]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md
[chevrotain]: https://github.com/SAP/chevrotain
