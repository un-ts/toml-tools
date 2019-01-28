const { tokenize } = require("../");
const { expect } = require("chai");

describe("The Toml Tools Lexer", () => {
  it("can tokenize a sample Toml", () => {
    const input = `# This is a TOML document.
title = "TOML Example"
`;
    const lexingResult = tokenize(input);
    expect(lexingResult.errors).to.be.empty;
    expect(lexingResult.tokens).to.have.lengthOf(6);
    const tokenImages = lexingResult.tokens.map(tok => tok.image);
    expect(tokenImages).to.deep.equal([
      "# This is a TOML document.",
      "\n",
      "title",
      "=",
      '"TOML Example"',
      "\n"
    ]);
  });
});
