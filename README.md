# minimal-bluebird-webpack-debug-issue
Demonstrates an issue with non-minified [Bluebird](https://github.com/petkaantonov/bluebird) defaulting to `debbuging=true` with [Webpack](https://github.com/webpack/webpack). This causes `longStackTraces` in Bluebird to always be true by default, which can result in **performance losses and memory leaks** due to `longStackTraces` holding onto references from a Promise instance's call stack longer than desired. (Additionally `warnings` and `wForgottenReturn` are also forced to `true` by default as a consequence)

First run:

```
npm install --production
```

Now edit `node_modules/bluebird/js/browser/bluebird.js` and search for the line containing `var debugging = ...`. 

Below this variable declaration add the following:

```
console.info('Debugging value:', debugging);
```

Compile and run:
```
npm run webpack
node dist/built.js
```

Observe the following output:
```
Debugging value: true
Done.
```

**Expected behavior:**

`debugging` value should be `false`, since the project was compiled for production

**Workaround:**

Explicitly pass in desired debug config to Bluebird's `Promise.config()`.

**Misc. Notes:**

-  The source pulled in by Webpack is apparently under: `node_modules/bluebird/js/browser/bluebird.js` (Can confirm with simple console logs). Appears to be related to how the package was published on NPM , as the original source is https://github.com/petkaantonov/bluebird/blob/master/src/debuggability.js#L20 . Additional details may be needed on the proper method to pull in the minified version into webpack instead of this dev version. If there is no way to do this, then the hard-coded `true` in the unminified Bluebird should probably be removed.

- Root cause of `debugging=false` caused by `__DEBUG__`: https://github.com/petkaantonov/bluebird/blob/master/src/debuggability.js#L20