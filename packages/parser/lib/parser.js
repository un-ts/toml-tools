const { Parser } = require("chevrotain");
const { tokensDictionary: t } = require("@toml-tools/lexer");

class TomlParser extends Parser {
  constructor() {
    super(t, {
      // TODO: toml will probably need more lookahead
      maxLookahead: 1,
    });

    const $ = this;

    $.RULE("Toml", () => {
      $.CONSUME(t.xxx);
    });

    this.performSelfAnalysis();
  }
}

module.exports = {
  TomlParser
};
