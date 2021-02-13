module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'prettier',
    'prettier/vue',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:jest/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/ban-types': 'off', // temporary - allow 'object'
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off', // allow optional vue-router dependency
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_.*$',
        varsIgnorePattern: '^_.*$',
      },
    ],
    'vue/attributes-order': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-dupe-keys': 'off', // seems broken
    'vue/require-default-prop': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        mocha: true,
      },
    },
  ],
}
