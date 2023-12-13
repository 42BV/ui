module.exports = {
  extends: ['plugin:import/errors'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'plugin:react/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: ['react-hooks', 'jest', 'react'],
      rules: {
        indent: 'off',
        'no-unused-vars': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/indent': ['off'],
        'react/prop-types': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-use-before-define': ['off'],
        '@typescript-eslint/explicit-member-accessibility': ['off'],
        '@typescript-eslint/no-empty-interface': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        'react-hooks/rules-of-hooks': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        'jest/prefer-expect-assertions': [
          'error',
          { onlyFunctionsWithAsyncKeyword: true }
        ],
        'import/named': ['off'] // https://github.com/typescript-eslint/typescript-eslint/issues/154
      }
    },
    {
      env: {
        browser: true,
        node: true,
        es6: true
      },
      files: ['*.js'],
      extends: ['eslint:recommended'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2017
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
