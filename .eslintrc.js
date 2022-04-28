// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    'prettier/vue'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'prettier'
  ],
  globals: {
    '$': true,
    'jQuery': true
  },
  // add your custom rules here
  'rules': {
    'prettier/prettier': ['error'],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    // others
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true
    }]
  }
}
