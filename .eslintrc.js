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
      plugins: ['react-hooks'],
      rules: {
        indent: 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: true
          }
        ],
        '@typescript-eslint/indent': ['off'],
        'react/prop-types': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-use-before-define': ['off'],
        '@typescript-eslint/explicit-member-accessibility': ['off'],
        '@typescript-eslint/no-empty-interface': ['off'],
        'react-hooks/rules-of-hooks': 'warn',
        'react-hooks/exhaustive-deps': 'warn'
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
