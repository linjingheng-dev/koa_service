module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "__dirname":true,
        "process":true,
        "Buffer":true,
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false,"argsIgnorePattern":"next|res|req|reject" }],
        "no-prototype-builtins":0,
        "require-atomic-updates":0
    }
};