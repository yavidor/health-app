import { defineConfig } from 'oxlint';

export default defineConfig({
  env: {
    node: true,
    es2021: true,
    browser: true,
  },
  ignorePatterns: ['AGENTS.md', 'docs/'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-expressions': 'warn',
  },
});
