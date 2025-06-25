import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import generatedBoundaries from './eslint.config.generated.mjs';

export default [
  ...generatedBoundaries,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        // // Browser globals
        // window: 'readonly',
        // document: 'readonly',
        console: 'readonly',
        // process: 'readonly',
        // Buffer: 'readonly',
        // global: 'readonly',
        // // Testing globals
        // describe: 'readonly',
        // it: 'readonly',
        // test: 'readonly',
        // expect: 'readonly',
        // beforeEach: 'readonly',
        // afterEach: 'readonly',
        // beforeAll: 'readonly',
        // afterAll: 'readonly',
        // fdescribe: 'readonly',
        // fit: 'readonly',
        // jasmine: 'readonly',
        // // Performance API
        // performance: 'readonly',
        // // Node.js globals
        // setImmediate: 'readonly',
        // clearImmediate: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      // Disable some import rules that are too strict for this project
      // 'import/no-unresolved': 'off',
      // 'import/named': 'off',
      // Additional TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Disable some rules that are not suitable for this project
      'no-undef': 'off', // TypeScript handles this
      // 'no-async-promise-executor': 'off',
    },
  },
  // {
  //   files: ['**/*.js', '**/*.mjs'],
  //   languageOptions: {
  //     ecmaVersion: 'latest',
  //     sourceType: 'module',
  //     globals: {
  //       console: 'readonly',
  //       process: 'readonly',
  //       Buffer: 'readonly',
  //       global: 'readonly',
  //     },
  //   },
  //   plugins: {
  //     // import: importPlugin,
  //   },
  //   rules: {
  //     // ...importPlugin.configs.recommended.rules,
  //     // 'import/no-extraneous-dependencies': ['error', {
  //     //   packageDir: './',
  //     //   devDependencies: false,
  //     //   optionalDependencies: false,
  //     //   peerDependencies: false
  //     // }],
  //     // 'import/no-unresolved': 'off',
  //     // 'import/named': 'off',
  //   },
  // },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
]; 