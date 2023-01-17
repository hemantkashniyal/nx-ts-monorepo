# MyApp

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

This project was generated using [Nx](https://nx.dev), see more details [here](./README.Nx.md).

---

## Create Apps/Packages within monorepo workspace

Mentioned below are the commands to create basic constructs as packages, angular apps, node apps etc. For more details please visit [Nx Docs](https://nx.dev/getting-started/).

`--dry-run` options shows the changes being applied on the filesystem, remove it and run command to apply the actual changes.

---

### Create a new Angular App

```
nx generate @nrwl/angular:application <angularAppName> --pascalCaseFiles --dry-run
```

### Add a new component to existing Angular App

```
nx generate @nrwl/angular:component --project=<angular-app-name> <newComponentName> --pascalCaseFiles --dry-run
```

---

### Create a new Express App

```
nx generate @nrwl/express:application <expressAppName> --pascalCaseFiles --dry-run
```

---

### Add a new Node based App

```
nx generate @nrwl/node:app firebase-functions --preset=ts --pascalCaseFiles --dry-run
nx generate @nrwl/node:app load-test --preset=ts --pascalCaseFiles --dry-run
```

---

## TS Buildable Package

```
nx generate @nrwl/js:library --name=common-models  --buildable --preset=ts --pascalCaseFiles --dry-run
nx generate @nrwl/js:library --name=server-lib  --buildable --preset=ts --pascalCaseFiles --dry-run
```

Add following lines additionally in [./tsconfig.base.json]() to facilitate deep nested imports within the app

```js
{
  ...
  "paths": {
    "@myapp/common-models/*": ["packages/common-models/src/*"]
    "@myapp/server-lib/*": ["packages/server-lib/src/*"]
  },
  ...
}
```

---

## TS Publishable Package (if want to publish as npm artifact)

```
nx generate @nrwl/js:library --name=client-lib  --publishable --importPath="@myapp/client-lib" --preset=ts --pascalCaseFiles --dry-run
```

Add following lines additionally in [./tsconfig.base.json]() to facilitate deep nested imports within the app

```js
{
  ...
  "paths": {
    "@myapp/client-lib/*": ["packages/client-lib/src/*"]
  },
  ...
}
```

---

### Setup unit test coverage

Include below mentioned config in `<app,lib>/jest.config.ts`

```js
{
  ...
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/"
  ],
  ...
}
```

---

## Steps to run system locally

- install nvm and enable configured nde version

  ```
  nvm use
  ```

- install application dependencies

  ```
  yarn
  ```

- build applications

  ```
  nx run-many --target=build
  ```

- start firebase emulator

  ```
  yarn firebase:emulate
  ```

- visit http://localhost:9595 for Firebase Emulator UI
