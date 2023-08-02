const { tokenize } = require("../");
const { expect } = require("chai");

describe("The Toml Tools Lexer", () => {
  it("can tokenize a sample Toml", () => {
    const input = `# This is a TOML document.
title = "TOML Example"
description1 = '''
Some
multiline
description
'''
description2 = """
Some
multiline
description
"""
`;
    const lexingResult = tokenize(input);
    expect(lexingResult.errors).to.be.empty;
    expect(lexingResult.tokens).to.have.lengthOf(14);
    const tokenImages = lexingResult.tokens.map((tok) => tok.image);
    expect(tokenImages).to.deep.equal([
      "# This is a TOML document.",
      "\n",
      "title",
      "=",
      '"TOML Example"',
      "\n",
      "description1",
      "=",
      "'''\nSome\nmultiline\ndescription\n'''",
      "\n",
      "description2",
      "=",
      '"""\nSome\nmultiline\ndescription\n"""',
      "\n",
    ]);
  });
});
