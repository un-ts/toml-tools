import Benchmark from "benchmark";
import _ from "lodash-es";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import klawSync from "klaw-sync";
import { parse as tomlToolsParse } from "@toml-tools/parser";
import { parse as iarnaTomlParse } from "@iarna/toml";
import { parse as tomlNode } from "toml";
import tomlj4 from "toml-j0.4";
import bombadil from "@sgarciac/bombadil";

const tomlj4Parse = tomlj4.parse;

function parseBombadil(input) {
  var reader = new bombadil.TomlReader();
  return reader.readToml(input);
}

const _dirname = path.dirname(fileURLToPath(import.meta.url));

// Processing the input samples **before** the benchmark
const samplesDir = path.join(_dirname, "./samples/");
const allSampleFiles = klawSync(samplesDir);
const tomlSampleFiles = _.filter(allSampleFiles, (fileDesc) =>
  fileDesc.path.endsWith(".toml"),
);
const relTomlFilesPaths = _.map(tomlSampleFiles, (fileDesc) =>
  path.relative(_dirname, fileDesc.path),
);
const tomlFilesContents = _.map(tomlSampleFiles, (fileDesc) =>
  fs.readFileSync(fileDesc.path, "utf8"),
);
const samplesRelPathToContent = _.zipObject(
  relTomlFilesPaths,
  tomlFilesContents,
);

function newSuite(name) {
  return new Benchmark.Suite(name, {
    onStart: () => console.log(`\n\n${name}`),
    onCycle: (event) => console.log(String(event.target)),
    onComplete: function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    },
  });
}

function bench(parseFunc) {
  _.forEach(samplesRelPathToContent, (tomlContent) => {
    parseFunc(tomlContent);
  });
}

// This is not a very meaningful benchmark
// There are different data structures being outputted here.
// - The Chevrotain based "@toml-tools/parser" output a Concrete Syntax Tree
//   - This is a large data structure with many arrays and maps that represents the actual Syntax.
// - Other Toml parsers used here will output an AST (JS/JSON object) that would include transformations on the data
//   - Date JS objects from Toml Date literals.
//   - Trimming whitespace in multiline strings.
//   - Converting binary/Hex decimals to JS numbers
//
// So it is hard to compare...
// Normally building an AST from a Chevrotain CST is a minor thing performance wise
// So I estimate a full TOML Compiler (To JSON) using TOML-Tools(with Chevrotain) would provide 80-90% of the
// performance Measured here of the Toml-Tools parser .
//
// Higher performance numbers could be gained with toml-tools if we avoid CST
// creation +60-70%, but that would reduce the potential for code re-use.
newSuite("Real World TOML samples Benchmark")
  .add("Toml-Tools", () => bench(tomlToolsParse))
  .add("@iarna/toml", () => bench(iarnaTomlParse))
  .add("BinaryMuse/toml-node", () => bench(tomlNode))
  .add("Bombadil", () => bench(parseBombadil))
  .add("toml-j4.0", () => bench(tomlj4Parse))
  .run({
    async: false,
    minSamples: 200,
  });
