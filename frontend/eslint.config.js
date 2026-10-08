import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintNoEmoji from 'eslint-plugin-no-emoji';
import eslintNoEmDash from 'eslint-plugin-no-em-dash';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', '.vite/**'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...js.configs.recommended,
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'no-emoji': eslintNoEmoji,
      'no-em-dash': eslintNoEmDash,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      // Fixture data reaches Screen tests only via `screens/screenTestUtils.ts`,
      // which asserts it against each Screen's data interface. A direct import
      // skips that assertion, so drift would only surface in a browser.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '../lib/mockData.json',
              message:
                "Read fixtures from screens/screenTestUtils.ts so they stay asserted against the Screen's data interface.",
            },
          ],
        },
      ],
      // Custom rules
      'no-emoji/no-emoji': 'error',
      'no-em-dash/no-em-dash': 'error',
    },
  },
  // The one file allowed to import fixtures directly, since that is where they
  // are asserted against each Screen's data interface.
  { files: ['src/screens/screenTestUtils.ts'], rules: { 'no-restricted-imports': 'off' } },
  prettier,
];
