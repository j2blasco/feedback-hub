import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import boundariesConfig from './eslint-boundaries.generated.mjs';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setImmediate: 'readonly',
        performance: 'readonly',
        // Browser globals  
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Allow console usage in specific contexts
      'no-console': 'off',
      // Allow unused vars for test parameters
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      // Allow any types in test files and specific implementations
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow async promise executors in specific cases
      'no-async-promise-executor': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        expect: 'readonly',
        jasmine: 'readonly',
        spyOn: 'readonly',
        fdescribe: 'readonly',
        fit: 'readonly',
      },
    },
  },
  // Import the generated boundaries configuration
  ...boundariesConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '*.js', '*.mjs']
  }
];