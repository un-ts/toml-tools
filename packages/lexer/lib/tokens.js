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

createToken({ name: "LBracket", pattern: "["});

module.exports = {
  tokensArray,
  tokensDictionary
};