import { TomlToAstParser } from "../lib/to-ast-parser.js";
import { TomlParser } from "@toml-tools/parser";
import chai from "chai";
import chaiExclude from "chai-exclude";

const { expect } = chai;

chai.use(chaiExclude);

describe("The Toml Tools to-ast parser", () => {
  /**
   * For performance reasons we are avoiding CST creation and thus
   * need to duplicate the parser code.
   * The least we cn do is validate that duplication.
   */
  it("exactly matches the grammar of the regular(to-cst) parser", () => {
    const toCstParserGrammar = Object.values(
      new TomlParser().getGAstProductions(),
    );
    const toAstParserGrammar = Object.values(
      new TomlToAstParser().getGAstProductions(),
    );

    toAstParserGrammar.forEach((toAstRule, idx) => {
      const toCstRule = toCstParserGrammar[idx];
      expect(toAstRule).excludingEvery(["orgText"]).to.deep.equal(toCstRule);
    });
  });
});
