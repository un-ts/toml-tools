const { TomlToAstParser } = require("../lib/to-ast-parser");
const { TomlParser } = require("@toml-tools/parser/lib/parser");
const chai = require("chai");
const chaiExclude = require("chai-exclude");

const { expect } = chai;
chai.use(chaiExclude);

describe("The Toml Tools to-ast parser", () => {
  /**
   * For performance reasons we are avoiding CST creation and thus
   * need to duplicate the parser code.
   * The least we cn do is validate that duplication.
   */
  it("exactly matches the grammar of the regular(to-cst) parser", () => {
    const toCstParserGrammar = new TomlParser().getGAstProductions().values();
    const toAstParserGrammar = new TomlToAstParser()
      .getGAstProductions()
      .values();

    toAstParserGrammar.forEach((toAstRule, idx) => {
      const toCstRule = toCstParserGrammar[idx];
      expect(toAstRule)
        .excludingEvery(["orgText"])
        .to.deep.equal(toCstRule);
    });
  });
});
