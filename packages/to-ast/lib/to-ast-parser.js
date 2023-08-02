import { CstParser } from "chevrotain";
import { tokensDictionary as t } from "@toml-tools/lexer";

class TomlToAstParser extends CstParser {
  constructor() {
    super(t, {
      maxLookahead: 1,
      outputCst: false,
    });

    const $ = this;

    $.C1 = null;
    $.C2 = null;

    $.RULE("toml", () => {
      const ast = {};

      $.OPTION(() => {
        $.SUBRULE($.nl);
      });
      $.OPTION2(() => {
        $.SUBRULE($.expression);
      });
      $.MANY(() => {
        $.SUBRULE2($.nl);
        $.OPTION3(() => {
          $.SUBRULE2($.expression);
        });
      });
    });

    $.RULE("expression", () => {
      $.OR(
        // https://sap.github.io/chevrotain/docs/guide/performance.html#arrays-of-alternatives
        $.C2 ||
          ($.C2 = [
            { ALT: () => $.SUBRULE($.keyval) },
            { ALT: () => $.SUBRULE($.table) },
            { ALT: () => $.CONSUME(t.Comment) },
          ]),
      );
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
      $.MANY(() => {
        $.CONSUME(t.Dot);
        $.CONSUME2(t.IKey);
      });
    });

    $.RULE("val", () => {
      // https://sap.github.io/chevrotain/docs/guide/performance.html#arrays-of-alternatives
      $.OR(
        $.C1 ||
          ($.C1 = [
            { ALT: () => $.CONSUME(t.IString) },
            { ALT: () => $.CONSUME(t.IBoolean) },
            { ALT: () => $.SUBRULE($.array) },
            { ALT: () => $.SUBRULE($.inlineTable) },
            { ALT: () => $.CONSUME(t.IDateTime) },
            { ALT: () => $.CONSUME(t.IFloat) },
            { ALT: () => $.CONSUME(t.IInteger) },
          ]),
      );
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
      let notDangling = true;
      $.MANY({
        GATE: () => notDangling,
        DEF: () => {
          $.CONSUME(t.Comma);
          $.SUBRULE2($.commentNewline);
          const foundVal = $.OPTION2(() => {
            $.SUBRULE2($.val);
          });

          if (foundVal === false) {
            notDangling = false;
          }
        },
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
      $.MANY(() => {
        $.CONSUME(t.Comma);
        $.SUBRULE2($.keyval);
      });
    });

    $.RULE("table", () => {
      // TODO: GATE to assert arrayTable tokens have no WS
      $.OR({
        IGNORE_AMBIGUITIES: true,
        DEF: [
          {
            GATE: () => $.LA(2).tokenType !== t.LSquare,
            ALT: () => $.SUBRULE($.stdTable),
          },
          { ALT: () => $.SUBRULE($.arrayTable) },
        ],
      });
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

export { TomlToAstParser };
