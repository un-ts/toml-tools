[![npm](https://img.shields.io/npm/v/@toml-tools/lexer.svg)](https://www.npmjs.com/package/@toml-tools/lexer)

# TOML-Tools/lexer

A Toml Lexer implemented in JavaScript using the [Chevrotain](https://github.com/SAP/chevrotain) Parsing Toolkit.

This package could be used as part of a Toml Parser,
a Toml syntax highlighter or any other use case where a Toml **Token Vector** would be useful.

## Installation

```bash
yarn add @toml-tools/lexer
# or if you prefer npm
npm install @toml-tools/lexer
```

## APIs

This package's [APIs](./api.d.ts) are exported as a TypeScript definition file.

## Usage

```javascript
const { tokenize } = require("@toml-tools/lexer");

const input = `# This is a TOML document.
title = "TOML Example"
`;
// Tokenize returns a Chevrotain IlexingResult
// - https://sap.github.io/chevrotain/documentation/4_2_0/interfaces/ilexingresult.html
const lexingResult = tokenize(input);
console.log(lexingResult.errors.length); // 0
console.log(lexingResult.tokens.length); // 6
const tokens = lexingResult.tokens;
// Each Token is a Chevrotain Itoken
//  - https://sap.github.io/chevrotain/documentation/4_2_0/interfaces/itoken.html
console.log(tokens[0].image); // "# This is a TOML document."
console.log(tokens[0].startLine); // 1
console.log(tokens[0].endOffset); // 26
// ...
```
