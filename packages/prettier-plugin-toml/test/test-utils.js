import prettier from "prettier";
import { expect } from "chai";
import { readFileSync } from "fs";
import { dirname, resolve, relative } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const pluginPath = "prettier-plugin-toml";

function testSample(importMeta, exclusive) {
  const testFolder = resolve(fileURLToPath(importMeta.url), "..");
  const itOrItOnly = exclusive ? it.only : it;
  const inputPath = resolve(testFolder, "_input.toml");
  const expectedPath = resolve(testFolder, "_output.toml");
  const relativeInputPath = relative(_dirname, inputPath);

  let inputContents;
  let expectedContents;

  before(() => {
    inputContents = readFileSync(inputPath, "utf8");
    expectedContents = readFileSync(expectedPath, "utf8");
  });

  itOrItOnly(`can format <${relativeInputPath}>`, async () => {
    const actual = await prettier.format(inputContents, {
      parser: "toml",
      plugins: [pluginPath],
    });

    expect(normalizeNewlines(actual)).to.equal(
      normalizeNewlines(expectedContents),
    );
  });

  it(`Performs a stable formatting for <${relativeInputPath}>`, async () => {
    const onePass = await prettier.format(inputContents, {
      parser: "toml",
      plugins: [pluginPath],
    });

    const secondPass = await prettier.format(onePass, {
      parser: "toml",
      plugins: [pluginPath],
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

export { testSample };
