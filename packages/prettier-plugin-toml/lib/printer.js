const { BaseTomlCstVisitor } = require("@toml-tools/parser");
const { concat, join, line, ifBreak, group } = require("prettier").doc.builders;

class TomlBeautifierVisitor extends BaseTomlCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  toml(ctx) {}

  expression(ctx) {}

  keyval(ctx) {}

  key(ctx) {}

  val(ctx) {}

  array(ctx) {}

  arrayValues(ctx) {}

  inlineTable(ctx) {}

  inlineTableKeyVals(ctx) {}

  table(ctx) {}

  stdTable(ctx) {}

  arrayTable(ctx) {}

  nl(ctx) {}

  commentNewline(ctx) {}
}

const beautifierVisitor = new TomlBeautifierVisitor();

function print(path, options, print) {
  // TODO: TBD
}

module.exports = {
  print
};
