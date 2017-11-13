# minimal-bluebird-webpack-debug-issue
Demonstrates an issue with `__DEBUG__` from [Bluebird's](https://github.com/petkaantonov/bluebird) source being compiled as `true` despite production settings in [Webpack](https://github.com/webpack/webpack). This causes `longStackTraces` in Bluebird to always be true by default, which can result in **performance losses and memory leaks** due to `longStackTraces` holding onto references from a Promise instance's call stack longer than desired. (Additionally `warnings` and `wForgottenReturn` are also forced to `true` by default as a consequence)

First run:

```
npm install
```

Now edit `node_modules/bluebird/js/browser/bluebird.js` and search for the line containing `var debugging = ...`.  Below this variable declaration add the following:

(e.g. https://github.com/petkaantonov/bluebird/blob/master/src/debuggability.js#L20 )
```
console.info('Debugging value:', debugging);
```

Compile the project:

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

`__DEBUG__` value should be `false`, since webpack should be compiling as production.

**Workaround:**

Explicitly pass in desired debug config to Bluebird's `Promise.config()`.


**Misc. Notes:**

-  While the workaround does resolve the core issue, note that internally bluebird is still looking at a `__DEBUG__` value of `true`.

- Attempting to specify `__DEBUG__` via `DefinePlugin` doesn't seem to have any effect

- There seems to be a lack of documentation on the web for the conventional use of `__DEBUG__` in JavaScript (Research suggests it is derived from Python?). Perhaps this should also be addressed on Bluebird's end by removing this flag, as there are already several other ways to configure its debugging flags. It also seems desirable to have webpack's documentation updated to explain where `__DEBUG__` is coming from, or ignore the flag altogether (unless explicitly passed via `DefinePlugin`).