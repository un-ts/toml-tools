const { parse, BaseTomlCstVisitorWithDefaults } = require("../");
const { expect } = require("chai");

describe("The Toml Tools Parser", () => {
  it("can parse a sample Toml", () => {
    class KeyNamesCollector extends BaseTomlCstVisitorWithDefaults {
      constructor() {
        super();
        this.tableKeyNames = [];
      }

      stdTable(ctx) {
        this.tableKeyNames.push(this.visit(ctx.key));
      }

      key(ctx) {
        const keyImages = ctx.IKey.map(keyTok => keyTok.image);
        const newKey = keyImages.join(".");
        return newKey;
      }
    }

    const input = `
# This is a TOML document.

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00 # First class dates

[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8002 ]
connection_max = 5000
enabled = true

[servers]

  # Indentation (tabs and/or spaces) is allowed but not required
  [servers.alpha]
  ip = "10.0.0.1"
  dc = "eqdc10"

  [servers.beta]
  ip = "10.0.0.2"
  dc = "eqdc10"

[clients]
data = [ ["gamma", "delta"], [1, 2] ]

# Line breaks are OK when inside arrays
hosts = [
  "alpha",
  "omega"
]
`;

    const cst = parse(input);

    const myVisitor = new KeyNamesCollector();
    myVisitor.visit(cst);

    expect(myVisitor.tableKeyNames).to.have.members([
      "owner",
      "database",
      "servers",
      "servers.alpha",
      "servers.beta",
      "clients"
    ]);
  });
});
