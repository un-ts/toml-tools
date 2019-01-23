const { Lexer } = require("chevrotain");
const { tokensArray, tokensDictionary } = require("./tokens");

const tomlLexer = new Lexer(tokensArray, { ensureOptimizations: true });

function tokenize(text) {
  return tomlLexer.tokenize(text);
}

module.exports = {
  tokenize,
  tokensDictionary
};
