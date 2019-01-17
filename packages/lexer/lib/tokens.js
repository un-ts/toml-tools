/* eslint-disable no-unused-vars */
"use strict";
const { createToken: createTokenOrg, Lexer } = require("chevrotain");

// A little mini DSL for easier lexer definition.
const fragments = {};

function inlineFragments(def) {
  let inlinedDef = def;
  Object.keys(fragments).forEach(prevFragmentName => {
    const prevFragmentDef = fragments[prevFragmentName];
    const templateRegExp = new RegExp(`{{${prevFragmentName}}}`, "g");
    inlinedDef = inlinedDef.replace(templateRegExp, prevFragmentDef);
  });
  return inlinedDef;
}

function FRAGMENT(name, def) {
  fragments[name] = inlineFragments(def);
}

function MAKE_PATTERN(def, flags) {
  const inlinedDef = inlineFragments(def);
  return new RegExp(inlinedDef, flags);
}

const tokensArray = [];
const tokensDictionary = {};
function createToken(options) {
  const newTokenType = createTokenOrg(options);
  tokensArray.push(newTokenType);
  tokensDictionary[options.name] = newTokenType;
  return newTokenType;
}

createToken({ name: "Newline", pattern: /\r\n/ });
createToken({ name: "Whitespace", pattern: / \t/ });
createToken({ name: "Comment", pattern: /#(?:[^\n\r]|\r(?!\n))*/, group: "comments" });
createToken({ name: "KeyValSep", pattern: "=" });
createToken({ name: "Dot", pattern: "." });
// TODO: how to distinguish this and integer?
//       - Maybe define that integer IS-A UnquotedKey using categories?
//               and sort out the order in the definition?
const UnquotedKey = createToken({ name: "UnquotedKey", pattern: /[A-Za-z0-9_-]+/ });
// TODO: a string Literal is-A quoted key (categorise)
createToken({ name: "QuotedKey", pattern: Lexer.NA });
createToken({
  name: "BasicString",
  // TODO: use regExp composition for better readability?
  // TODO: '\r' by itself is not a newline in toml so should we allow "\r" NOT followed by \n
  pattern: /"(?:[^\\"\n\r]|\\(?:[btnfr"\\]|u[0-9a-fA-F]{4}(?:[0-9a-fA-F]{4})?))*"/
});

createToken({
  name: "BasicMultiLineString",
  // TODO: use regExp composition for better readability?
  pattern: /"""(?:[^\\\r"]|\r\n|\\(?:[btnfr"\\]|u[0-9a-fA-F]{4}(?:[0-9a-fA-F]{4})?))*"""/
});
createToken({
  name: "LiteralString",
  // TODO: probably better to avoid using NOT to define the strings
  //  and align with the semi official spec
  pattern: /'(?:[^'\r\n])*'/
});
createToken({
  name: "LiteralMultiLineString",
  pattern: /'''(?:[^'\r]|\r\n)*'''/
});
const Integer = createToken({
  name: "Integer",
  pattern: Lexer.NA
});
createToken({
  name: "DecimalInt",
  pattern: /[+-]:0|[1-9](_?\d)*/,
  // Not that DecimalInt is both an Integer **and** an UnquotedKey
  categories: [Integer, UnquotedKey],
  // because "123Hello" is an UnquotedKey
  longer_alt: UnquotedKey
});
createToken({
  name: "HexInt",
  pattern: /0x[0-9A-F](?:_?[0-9A-F])*/,
  categories: [Integer]
});
createToken({
  name: "OctInt",
  pattern: /0o[0-7](?:_?[0-7])*/,
  categories: [Integer]
});
createToken({
  name: "BinInt",
  pattern: /0b[0-1](?:_?[0-1])*/,
  categories: [Integer]
});

module.exports = {
  tokensArray,
  tokensDictionary
};