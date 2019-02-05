[![npm](https://img.shields.io/npm/v/@toml-tools/parser.svg)](https://www.npmjs.com/package/@toml-tools/parser)

# TOML-Tools/parser

A Toml **Parser** implemented in JavaScript using the [Chevrotain](https://github.com/SAP/chevrotain) Parsing Toolkit.
This parser outputs a Chevrotain [**C**oncrete **S**yntax **T**ree](https://sap.github.io/chevrotain/docs/guide/concrete_syntax_tree.html)
Which is a low level data structure that represents the **whole** syntax tree.

- including comments and newline information.
- Including full position information on every Token.

This means that this parser could be **re**-used to construct many different kinds of Toml related tooling:

- Toml to JSON compilers.
- Toml to Yaml compilers.
  - comments information is needed.
- Toml source code beautifiers.
  - Once again comments information is needed.
- Toml Schema Validator
  - Full position information is required for useful error messages.
- and more...

## Installation

```bash
yarn add @toml-tools/parser
# or if you prefer npm
npm install @toml-tools/parser
```

## APIs

This package's [APIs](./api.d.ts) are exported as a TypeScript definition file.

## Usage

```javascript
const {
  parse,
  BaseTomCstVisitor,
  BaseTomlCstVisitorWithDefaults
} = require("@toml-tools/parser");

const input = `
# This is a TOML document.
[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8002 ]
`;
const tomlCst = parse(input);

// Read the manual for using the Chevrotain CST visitor:
// - https://sap.github.io/chevrotain/docs/guide/concrete_syntax_tree.html#cst-visitor
// - The full APIs for the CST visitor are defined in api.d.ts linked above
class KeyNamesCollector extends BaseTomlCstVisitorWithDefaults {
  constructor() {
    super();
    this.tableKeyNames = [];
  }

  stdTable(ctx) {
    this.tableKeyNames.push(this.visit(ctx.key));
  }

  key(ctx) {
    const keyImages = ctx.IKey.map(keyTok => keyTok.image);
    const newKey = keyImages.join(".");
    return newKey;
  }
}

const myVisitor = new KeyNamesCollector();
myVisitor.visit(cst);

console.log(myVisitor.tableKeyNames.length); // 1
console.log(myVisitor.tableKeyNames[0]); // "database"
```
