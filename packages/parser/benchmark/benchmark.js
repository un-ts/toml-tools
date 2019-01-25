const Benchmark = require("benchmark");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const klawSync = require("klaw-sync");
const tomlToolsParse = require("../").parse;

// Processing the input samples **before** the benchmark
const samplesDir = path.join(__dirname, "./samples/");
const allSampleFiles = klawSync(samplesDir);
const tomlSampleFiles = _.filter(allSampleFiles, fileDesc =>
  fileDesc.path.endsWith(".toml")
);
const relTomlFilesPaths = _.map(tomlSampleFiles, fileDesc =>
  path.relative(__dirname, fileDesc.path)
);
const tomlFilesContents = _.map(tomlSampleFiles, fileDesc =>
  fs.readFileSync(fileDesc.path, "utf8")
);
const samplesRelPathToContent = _.zipObject(
  relTomlFilesPaths,
  tomlFilesContents
);

function newSuite(name) {
  return new Benchmark.Suite(name, {
    onStart: () => console.log(`\n\n${name}`),
    onCycle: event => console.log(String(event.target)),
    onComplete: function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    }
  });
}

function bench(parseFunc) {
  _.forEach(samplesRelPathToContent, tomlContent => {
    parseFunc(tomlContent);
  });
}

newSuite("Real World TOML samples Benchmark")
  .add("Toml-Tools", () => bench(tomlToolsParse))
  .run({
    async: false
  });
