const prettier = require("prettier");
const { expect } = require("chai");
const { readFileSync } = require("fs");
const { resolve, relative } = require("path");

const pluginPath = resolve(__dirname, "../");
function testSample(testFolder, exclusive) {
  const itOrItOnly = exclusive ? it.only : it;
  const inputPath = resolve(testFolder, "_input.toml");
  const expectedPath = resolve(testFolder, "_output.toml");
  const relativeInputPath = relative(__dirname, inputPath);

  let inputContents;
  let expectedContents;

  before(() => {
    inputContents = readFileSync(inputPath, "utf8");
    expectedContents = readFileSync(expectedPath, "utf8");
  });

  itOrItOnly(`can format <${relativeInputPath}>`, () => {
    const actual = prettier.format(inputContents, {
      parser: "toml",
      plugins: [pluginPath]
    });

    expect(normalizeNewlines(actual)).to.equal(
      normalizeNewlines(expectedContents)
    );
  });

  it(`Performs a stable formatting for <${relativeInputPath}>`, () => {
    const onePass = prettier.format(inputContents, {
      parser: "toml",
      plugins: [pluginPath]
    });

    const secondPass = prettier.format(onePass, {
      parser: "toml",
      plugins: [pluginPath]
    });
    expect(onePass).to.equal(secondPass);
  });
}

/**
 * To avoid OS related line terminator
 */
function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n");
}

module.exports = {
  testSample
};
