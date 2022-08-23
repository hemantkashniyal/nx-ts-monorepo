# Create New

## NX Project
```
npx create-nx-workspace myapp --preset=ts --package-manager=yarn
```

## TS Buildable Package
```
nx generate @nrwl/js:library --name=server-lib  --buildable --preset=ts
```

## TS Publishable Package
```
nx generate @nrwl/js:library --name=client-lib  --publishable --importPath="@myapp/client-lib" --preset=ts
```

## Angular App
```
nx generate @nrwl/angular:application myAngularApp
nx generate @nrwl/angular:application myAwesomeApp
```

## Angular App Component
```
nx generate @nrwl/angular:component --project=my-angular-app awesomeComponent --dry-run
```

## Node based Application
```
nx generate @nrwl/node:app firebase-functions --preset=ts
```

## Setup unit test coverage
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
