# Example of using prettier-plugin-toml

The toml-prettier-plugin will be loaded automatically by prettier
for formatting .toml files.

In this package prettier is used to format toml files
via npm scripts.

## Try it out

### Using GitPod WebIDE

1. Open [this package in Gitpod](https://gitpod.io/#https://github.com/bd82/toml-tools/tree/master/test-packages/test-prettier-plugin-toml).
2. ```bash
      # Only Once
      cd test-packages/test-prettier-plugin-toml/
      npm install
   ```
3. Add or modify .toml files in this folder.
4. ```bash
      npm run format:fix
   ```
5. inspect the formatted files.

### From your local machine

```bash
git clone https://github.com/bd82/toml-tools.git
cd toml-tools/test-packages/test-prettier-plugin-toml
npm install
# Add or modify .toml files in this folder.
npm run format:fix
# inspect the formatted files.
```
