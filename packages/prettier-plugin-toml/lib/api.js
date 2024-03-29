import { locStart, locEnd } from "./loc.js";
import { parse } from "@toml-tools/parser";
import { print } from "./printer.js";

// https://prettier.io/docs/en/plugins.html#languages
const languages = [
  {
    extensions: [".toml"],
    name: "Toml",
    parsers: ["toml"],
    type: "data",
    filenames: ["Cargo.lock", "Gopkg.lock"],
    tmScope: "source.toml",
    aceMode: "toml",
    codemirrorMode: "toml",
    codemirrorMimeType: "text/x-toml",
    language_id: 365,
    vscodeLanguageIds: ["toml"],
  },
];

// https://prettier.io/docs/en/plugins.html#parsers
const parsers = {
  toml: {
    astFormat: "toml-cst",
    parse: (text, parsers, options) => parse(text),
    locStart,
    locEnd,
  },
};

// https://prettier.io/docs/en/plugins.html#printers
const printers = {
  "toml-cst": {
    print,
  },
};

export {
  languages,
  parsers,
  printers,
  // TODO: are any options/default options needed?
  //  - Prefer certain inline variants when possible?
  //  - Indent nested props?
};
