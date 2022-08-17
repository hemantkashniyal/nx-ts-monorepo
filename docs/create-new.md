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
