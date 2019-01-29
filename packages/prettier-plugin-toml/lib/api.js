const { locStart, locEnd } = require("./loc");
const { parse } = require("./parser");
const { print } = require("./printer");

// https://prettier.io/docs/en/plugins.html#languages
const languages = [
  {
    extensions: [".toml"],
    name: "Toml",
    parsers: ["toml"]
  }
];

// https://prettier.io/docs/en/plugins.html#parsers
const parsers = {
  toml: {
    astFormat: "toml-cst",
    parse,
    locStart,
    locEnd
  }
};

// https://prettier.io/docs/en/plugins.html#printers
const printers = {
  "toml-cst": {
    print
  }
};

module.exports = {
  languages,
  parsers,
  printers
  // TODO: are any options/default options needed?
  //  - Prefer certain inline variants when possible?
  //  - Indent nested props?
};
