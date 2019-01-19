/* eslint-disable no-unused-vars */
"use strict";
const { createToken: createTokenOrg, Lexer } = require("chevrotain");

// A little mini DSL for easier lexer definition.
const fragments = {};
const f = fragments;

function FRAGMENT(name, def) {
  fragments[name] = typeof def === "string" ? def : def.source;
}

function makePattern(strings, ...args) {
  let combined = "";
  for (let i = 0; i < strings.length; i++) {
    combined += strings[i];
    if (i < args.length) {
      // By wrapping in a RegExp (none) capturing group
      // We enabled the safe usage of qualifiers and assertions.
      combined += `(?:${args[i]})`;
    }
  }
  return new RegExp(combined);
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
createToken({
  name: "Comment",
  pattern: /#(?:[^\n\r]|\r(?!\n))*/,
  group: "comments"
});
createToken({ name: "KeyValSep", pattern: "=" });
createToken({ name: "Dot", pattern: "." });
const IQuotedKey = createToken({ name: "IQuotedKey", pattern: Lexer.NA });
const IUnquotedKey = createToken({ name: "IUnquotedKey", pattern: Lexer.NA });

// TODO: fragments for string literals refactoring
// FRAGMENT("time_secfrac", /"."\d+/);
// FRAGMENT("time_numoffset ", makePattern`[+-]${f.time_hour}${f.time_minute}`);

const IString = createToken({ name: "IString", pattern: Lexer.NA });
createToken({
  name: "BasicString",
  // TODO: use regExp composition for better readability?
  // TODO: '\r' by itself is not a newline in toml so should we allow "\r" NOT followed by \n
  pattern: /"(?:[^\\"\n\r]|\\(?:[btnfr"\\]|u[0-9a-fA-F]{4}(?:[0-9a-fA-F]{4})?))*"/,
  categories: [IString, IQuotedKey]
});
createToken({
  name: "BasicMultiLineString",
  // TODO: use regExp composition for better readability?
  pattern: /"""(?:[^\\\r"]|\r\n|\\(?:[btnfr"\\]|u[0-9a-fA-F]{4}(?:[0-9a-fA-F]{4})?))*"""/,
  categories: [IString]
});
createToken({
  name: "LiteralString",
  // TODO: probably better to avoid using NOT to define the strings
  //  and align with the semi official spec
  pattern: /'(?:[^'\r\n])*'/,
  categories: [IString, IQuotedKey]
});
createToken({
  name: "LiteralMultiLineString",
  pattern: /'''(?:[^'\r]|\r\n)*'''/,
  categories: [IString]
});
const IBoolean = createToken({
  name: "Boolean",
  pattern: Lexer.NA,
  categories: [IUnquotedKey]
});
const True = createToken({
  name: "True",
  pattern: /true/,
  categories: [IBoolean]
});
const False = createToken({
  name: "False",
  pattern: /false/,
  categories: [IBoolean]
});
const DateTime = createToken({
  name: "DateTime",
  pattern: Lexer.NA
});
FRAGMENT("date_fullyear", /\d{4}/);
FRAGMENT("date_month", /\d{2}/);
FRAGMENT("date_mday", /\d{2}/);
FRAGMENT("time_delim", /[tT ]/);
FRAGMENT("time_hour", /\d{2}/);
FRAGMENT("time_minute", /\d{2}/);
FRAGMENT("time_second", /\d{2}/);
FRAGMENT("time_secfrac", /"."\d+/);
FRAGMENT("time_numoffset ", makePattern`[+-]${f.time_hour}${f.time_minute}`);
FRAGMENT("time_offset ", makePattern`z|${f.time_numoffset}`);
FRAGMENT(
  "partial_time ",
  makePattern`${f.time_hour}:${f.time_minute}:${f.time_second}${
    f.time_secfrac
  }?`
);
FRAGMENT(
  "full_date ",
  makePattern`${f.time_hour}-${f.date_month}-${f.date_mday}`
);
FRAGMENT("full_time ", makePattern`${f.partial_time}${f.time_offset}`);
createToken({
  name: "OffsetDateTime",
  pattern: makePattern`${f.full_date}${f.time_delim}${f.full_time}`,
  categories: [DateTime]
});
createToken({
  name: "LocalDateTime",
  pattern: makePattern`${f.full_date}${f.time_delim}${f.partial_time}`,
  categories: [DateTime]
});
createToken({
  name: "LocalDate",
  pattern: makePattern`${f.full_date}`,
  categories: [DateTime]
});
createToken({
  name: "LocalTime",
  pattern: makePattern`${f.partial_time}`,
  categories: [DateTime]
});
const IInteger = createToken({
  name: "IInteger",
  pattern: Lexer.NA
});
const DecimalInt = createToken({
  name: "DecimalInt",
  pattern: /[+-]?(?:0|[1-9](?:_?\d)*)/,
  // Not that DecimalInt is both an IInteger **and** an IUnquotedKey
  categories: [IInteger, IUnquotedKey]
});
createToken({
  name: "HexInt",
  pattern: /0x[0-9A-F](?:_?[0-9A-F])*/,
  categories: [IInteger]
});
createToken({
  name: "OctInt",
  pattern: /0o[0-7](?:_?[0-7])*/,
  categories: [IInteger]
});
createToken({
  name: "BinInt",
  pattern: /0b[0-1](?:_?[0-1])*/,
  categories: [IInteger]
});
const IFloat = createToken({
  name: "IFloat",
  pattern: Lexer.NA
});
FRAGMENT("float_int_part", DecimalInt.PATTERN);
FRAGMENT("decimal_point", /\./);
FRAGMENT("zero_prefixable_int", /\d(?:_\d)*/);
FRAGMENT("frac", makePattern`${f.decimal_point}${f.zero_prefixable_int}`);
createToken({
  name: "Float",
  pattern: makePattern`${f.float_int_part}(?:${f.exp}|${f.frac}${f.exp})`,
  categories: [IFloat]
});
createToken({
  name: "SpecialFloat",
  pattern: /[+-](?:inf|nan)/,
  categories: [IFloat]
});
createToken({
  name: "LSquare",
  pattern: "["
});
createToken({
  name: "RSquare",
  pattern: "]"
});
createToken({
  name: "Comma",
  pattern: ","
});
createToken({
  name: "LCurly",
  pattern: "{"
});
createToken({
  name: "RCurly",
  pattern: "}"
});

const UnquotedKey = createToken({
  name: "UnquotedKey",
  pattern: /[A-Za-z0-9_-]+/,
  categories: [IUnquotedKey]
});
const possibleUnquotedKeysPrefixes = [True, False, DecimalInt];
possibleUnquotedKeysPrefixes.forEach(tokType => {
  tokType.LONGER_ALT = UnquotedKey;
});

module.exports = {
  tokensArray,
  tokensDictionary
};
