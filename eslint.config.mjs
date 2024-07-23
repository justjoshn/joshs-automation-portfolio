import playwright from 'eslint-plugin-playwright'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['node_modules/**', 'dist/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node },
    },
    plugins: { '@typescript-eslint': tsPlugin, playwright: playwright },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...playwright.configs['flat/recommended'].rules,
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
