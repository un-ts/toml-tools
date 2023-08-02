const { tokenize } = require("@toml-tools/lexer");
const { TomlToAstParser } = require("./to-ast-parser");

const parser = new TomlToAstParser();

// TODO: should we extract this API to its own package to avoid duplication?
function parse(inputText) {
  // Lex
  const lexResult = tokenize(inputText);
  parser.input = lexResult.tokens;

  if (lexResult.errors.length > 0) {
    const firstError = lexResult.errors[0];
    throw Error(
      "Sad sad panda, lexing errors detected in line: " +
        firstError.line +
        ", column: " +
        firstError.column +
        "!\n" +
        firstError.message
    );
  }

  const jsObj = parser.toml();
  if (parser.errors.length > 0) {
    const error = parser.errors[0];
    throw Error(
      "Sad sad panda, parsing errors detected in line: " +
        error.token.startLine +
        ", column: " +
        error.token.startColumn +
        "!\n" +
        error.message +
        "!\n\t->" +
        // TODO: should the stack always appear on errors msg?
        error.context.ruleStack.join("\n\t->")
    );
  }

  return jsObj;
}

module.exports = {
  parse,
};
