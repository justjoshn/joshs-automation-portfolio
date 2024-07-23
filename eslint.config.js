const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const playwrightPlugin = require('eslint-plugin-playwright')
const eslintConfigPrettier = require('eslint-config-prettier')
const globals = require('globals')

module.exports = [
  { ignores: ['node_modules/**', 'dist/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node },
    },
    plugins: { '@typescript-eslint': tsPlugin, playwright: playwrightPlugin },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...playwrightPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-focused-test': 'warn',
      'playwright/valid-expect': 'error',
    },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        page: 'readonly',
        browser: 'readonly',
        context: 'readonly',
        expect: 'readonly',
      },
    },
  },
  eslintConfigPrettier,
]
