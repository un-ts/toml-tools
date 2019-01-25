const { Lexer } = require("chevrotain");
const { tokensArray, tokensDictionary } = require("./tokens");

const tomlLexer = new Lexer(tokensArray, {
  // Reducing the amount of position tracking can provide a small performance boost (<10%)
  // Likely best to keep the full info for better error position reporting and
  // to expose "fuller" ITokens from the Lexer.
  positionTracking: "full",
  ensureOptimizations: true
});

function tokenize(text) {
  return tomlLexer.tokenize(text);
}

module.exports = {
  tokenize,
  tokensDictionary
};
