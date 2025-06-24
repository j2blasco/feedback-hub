module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['tsconfig.json'],
        createDefaultProgram: true
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended'
      ],
      rules: {
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
      }
    },
    {
      files: ['*.html'],
      extends: []
    }
  ]
};