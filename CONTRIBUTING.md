# Contributing to Toml-Tools

To get up and running, install the dependencies and run the full build:

```bash
yarn
yarn ci
```

You can also inspect the other available dev flows scripts:

```bash
yarn run
```

## Formatting

The toml-tools source code is formatted using prettier.
Modified files will be formatted **incrementally** using a git commit hook via [lint staged](https://github.com/okonet/lint-staged).

Reformatting the whole project can be invoked using:

```bash
yarn run format:fix
```

## Unit Testing

All Unit tests in this project are implemented with the [Mocha testing framework](https://mochajs.org/)
and the [Chai](https://www.chaijs.com/) assertion library.
The choice of Mocha versus some of the newer testing libraries (Jest/Ava) was intentional,
Mocha was chosen in order to avoid separate processes per test file which means paying the initialization cost
of a Chevrotain based Parser multiple times per tests execution.
