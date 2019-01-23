const { Parser } = require("chevrotain");
const { tokensDictionary: t } = require("@toml-tools/lexer");

class TomlParser extends Parser {
  constructor() {
    super(t, {
      // TODO: Is one Token Lookahead sufficient?
      maxLookahead: 1,
      ignoredIssues: {
        table: {
          OR: true
        }
      }
    });

    const $ = this;

    $.RULE("toml", () => {
      $.OPTION(() => {
        $.SUBRULE($.nl);
      });
      $.SUBRULE($.expression);
      $.MANY(() => {
        $.SUBRULE2($.nl);
        $.OPTION2(() => {
          $.SUBRULE2($.expression);
        });
      });
    });

    $.RULE("expression", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.keyval) },
        { ALT: () => $.SUBRULE($.table) },
        { ALT: () => $.CONSUME(t.Comment) }
      ]);
      $.OPTION(() => {
        $.CONSUME2(t.Comment);
      });
    });

    $.RULE("keyval", () => {
      $.SUBRULE($.key);
      $.CONSUME(t.KeyValSep);
      $.SUBRULE($.val);
    });

    $.RULE("key", () => {
      $.CONSUME(t.IKey);
      $.OPTION(() => {
        $.CONSUME(t.Dot);
        $.CONSUME2(t.IKey);
      });
    });

    $.RULE("val", () => {
      $.OR([
        { ALT: () => $.CONSUME(t.IString) },
        { ALT: () => $.CONSUME(t.IBoolean) },
        { ALT: () => $.SUBRULE($.array) },
        { ALT: () => $.SUBRULE($.inlineTable) },
        { ALT: () => $.CONSUME(t.IDateTime) },
        { ALT: () => $.CONSUME(t.IFloat) },
        { ALT: () => $.CONSUME(t.IInteger) }
      ]);
    });

    $.RULE("array", () => {
      $.CONSUME(t.LSquare);
      $.OPTION(() => {
        $.SUBRULE($.arrayValues);
      });
      $.SUBRULE($.commentNewline);
      $.CONSUME(t.RSquare);
    });

    $.RULE("arrayValues", () => {
      $.SUBRULE($.commentNewline);
      $.SUBRULE($.val);
      $.MANY(() => {
        $.CONSUME(t.Comma);
        $.SUBRULE2($.commentNewline);
        $.SUBRULE2($.val);
      });
      // Dangling Comma
      $.OPTION2(() => {
        $.CONSUME2(t.Comma);
      });
    });

    $.RULE("inlineTable", () => {
      $.CONSUME(t.LCurly);
      $.OPTION(() => {
        $.SUBRULE($.inlineTableKeyVals);
      });
      $.CONSUME(t.RCurly);
    });

    $.RULE("inlineTableKeyVals", () => {
      $.SUBRULE($.keyval);
      $.OPTION(() => {
        $.CONSUME(t.Comma);
        $.SUBRULE2($.keyval);
      });
    });

    $.RULE("table", () => {
      // TODO: GATE to assert arrayTable tokens have no WS
      $.OR([
        {
          GATE: () => $.LA(2).tokenType !== t.LSquare,
          ALT: () => $.SUBRULE($.stdTable)
        },
        { ALT: () => $.SUBRULE($.arrayTable) }
      ]);
    });

    $.RULE("stdTable", () => {
      $.CONSUME(t.LSquare);
      $.SUBRULE($.key);
      $.CONSUME(t.RSquare);
    });

    $.RULE("arrayTable", () => {
      $.CONSUME(t.LSquare);
      $.CONSUME2(t.LSquare);
      $.SUBRULE($.key);
      // TODO: verify these two RSquare are in sequence with no WS
      $.CONSUME(t.RSquare);
      $.CONSUME2(t.RSquare);
    });

    $.RULE("nl", () => {
      $.AT_LEAST_ONE(() => {
        $.CONSUME(t.Newline);
      });
    });

    $.RULE("commentNewline", () => {
      $.MANY(() => {
        $.OPTION(() => {
          $.CONSUME(t.Comment);
        });
        $.CONSUME(t.Newline);
      });
    });

    this.performSelfAnalysis();
  }
}

module.exports = {
  TomlParser
};
