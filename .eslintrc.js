module.exports = {
  settings: {
    "import/resolver": {
      node: {
        paths: ["./src"],
      },
    },
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
  },
  extends: "@pancakeswap/eslint-config-pancake",
  rules: {
    "no-console": [
      "warn",
      { allow: ["info", "warn", "error", "log", "debug"] },
    ],
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    "no-plusplus": 0,
    "prefer-destructuring": ["warn", { object: true, array: false }],
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "import/no-cycle": [2, { maxDepth: 1 }],
    // Start temporary rules
    // These rules are here just to keep the lint error to 0 during the migration to the new rule set
    // They need to be removed and fixed as soon as possible
    "@typescript-eslint/ban-ts-comment": [
      1,
      { "ts-ignore": false, "ts-nocheck": false },
    ],
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    radix: 0,
    "import/no-extraneous-dependencies": 0,
    "jsx-a11y/media-has-caption": 0,
    // Exchange
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state", "memo", "p", "e", "event"],
      },
    ],
    "react/require-default-props": 0,
    "no-nested-ternary": 0,
    "max-classes-per-file": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-empty-function": 0,
    "import/no-unresolved": [2, { caseSensitive: false }],
    camelcase: [0, { properties: "never" }],
    "react/jsx-filename-extension": 0,
    "react/default-props-match-prop-types": 0,
    "react/no-array-index-key": 0,
    // End temporary rules
  },
};
