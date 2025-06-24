import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    ignores: ['src/utils/results.ts'], // Allow the abstraction layer to import the external library
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Restrict direct imports from external libraries to enforce abstraction layer
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@j2blasco/ts-result',
              message: 'Direct imports from @j2blasco/ts-result are not allowed. Use the abstraction from "src/utils/results" instead.'
            }
          ],
          patterns: [
            {
              group: ['**/node_modules/@j2blasco/ts-result/**'],
              message: 'Direct imports from @j2blasco/ts-result are not allowed. Use the abstraction from "src/utils/results" instead.'
            }
          ]
        }
      ]
    },
  },
  {
    // Allow the abstraction file to import from the external library
    files: ['src/utils/results.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // No import restrictions for the abstraction layer file
    },
  },
  {
    files: ['**/*.html'],
    rules: {}
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
];