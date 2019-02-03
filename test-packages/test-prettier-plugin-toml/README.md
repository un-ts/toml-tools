# Example of using prettier-plugin-toml

The toml-prettier-plugin will be loaded automatically by prettier
for formatting .toml files.

In this package prettier is used to format toml files
via npm scripts.

## Try it out

```bash
git clone https://github.com/bd82/toml-tools.git
cd toml-tools/test-packages/test-prettier-plugin-toml
npm install
# Add or modify .toml files in this folder.
npm run format:fix
# inspect the formatted files
```
