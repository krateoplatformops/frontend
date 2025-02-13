// @ts-check
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import restrictedGlobals from 'confusing-browser-globals'
// @ts-ignore
import pluginImport from 'eslint-plugin-import'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginNode from 'eslint-plugin-n'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

const ignoredPaths = [
  '.yarn/**/*',
  '**/node_modules/**/*',
  '.pnp.*',
  'www/**/*',
  '**/dist/**/*',
  '**/build/**/*',
  'loader/**/*',
  'public/**/*',
  'website/**/*',
  'playwright-report/**/*',
  '.vscode/**/*',
  '.idea/**/*',
]

export default tsEslint.config(
  { ignores: ignoredPaths, name: 'Ignored files' },

  {
    files: ['**/*.{mjs,cjs,js,ts,jsx,tsx}'],
    languageOptions: { ecmaVersion: 12 },
    linterOptions: { reportUnusedDisableDirectives: 'warn' },
    name: 'Base config',
    plugins: {
      '@stylistic/js': stylisticJs,
      import: pluginImport,
      // @ts-ignore
      n: pluginNode,
    },
    rules: {
      'sort-keys': 0,
      'sort-keys/sort-keys-fix': 1,
      // http://eslint.org/docs/rules/
      '@stylistic/js/array-bracket-spacing': ['error', 'never'],
      '@stylistic/js/arrow-spacing': 'error',
      '@stylistic/js/block-spacing': ['error', 'always'],
      '@stylistic/js/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/js/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          exports: 'always-multiline',
          functions: 'ignore',
          imports: 'always-multiline',
          objects: 'always-multiline',
        },
      ],
      '@stylistic/js/comma-spacing': 'error',
      '@stylistic/js/comma-style': 'error',
      '@stylistic/js/computed-property-spacing': ['error', 'never'],
      '@stylistic/js/dot-location': ['error', 'property'],
      '@stylistic/js/eol-last': 'error',
      '@stylistic/js/func-call-spacing': 'off',
      'array-callback-return': 'error',
      '@stylistic/js/generator-star-spacing': 'error',
      'block-scoped-var': 'error',
      camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }],
      'constructor-super': 'error',
      curly: 'error',
      'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
      eqeqeq: ['error', 'smart'],
      '@stylistic/js/indent': ['error', 2],
      'for-direction': 'error',
      '@stylistic/js/key-spacing': 'error',
      'func-name-matching': 'error',
      '@stylistic/js/keyword-spacing': 'error',
      'func-names': ['error', 'as-needed'],
      '@stylistic/js/line-comment-position': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      'getter-return': 'error',
      '@stylistic/js/lines-around-comment': 'off',
      'global-require': 'error',
      '@stylistic/js/max-statements-per-line': ['error', { max: 2 }],
      'guard-for-in': 'error',
      '@stylistic/js/new-parens': 'error',
      'handle-callback-err': 'error',
      '@stylistic/js/newline-per-chained-call': [
        'error',
        { ignoreChainWithDepth: 3 },
      ],
      'id-blacklist': ['error', 'e', 'er', 'cb'],
      'id-length': [
        'error',
        {
          exceptions: ['_', 'i', 'j', 'x', 'y', 'z'],
          min: 2,
          properties: 'never',
        },
      ],
      'max-depth': ['error', 4],
      '@stylistic/js/no-confusing-arrow': ['error', { allowParens: true }],
      'max-lines': [
        'error',
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
      'max-statements': ['off'],
      'no-array-constructor': 'error',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      'no-console': ['error', { allow: ['error'] }],
      'no-const-assign': 'error',
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': 'error',
      'no-empty': 'error',
      '@stylistic/js/no-extra-parens': ['error', 'functions'],
      'no-empty-character-class': 'error',
      '@stylistic/js/no-extra-semi': 'error',
      'no-empty-function': 'error',
      '@stylistic/js/no-floating-decimal': 'error',
      'no-empty-pattern': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-label': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-import-assign': 'error',
      'no-inner-declarations': 'error',
      '@stylistic/js/no-mixed-operators': [
        'error',
        {
          allowSamePrecedence: false,
          groups: [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
        },
      ],
      'no-invalid-regexp': 'error',
      '@stylistic/js/no-mixed-spaces-and-tabs': 'error',
      'no-irregular-whitespace': 'error',
      '@stylistic/js/no-multi-spaces': 'error',
      'no-iterator': 'error',
      '@stylistic/js/no-multiple-empty-lines': 'error',
      'no-label-var': 'error',
      'no-labels': ['error', { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-require': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-path-concat': 'error',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-proto': 'error',
      'no-prototype-builtins': 'error',
      'no-regex-spaces': 'error',
      // @ts-ignore
      'no-restricted-globals': ['error'].concat(restrictedGlobals),
      'no-restricted-properties': [
        'error',
        {
          message: 'Please use import() instead',
          object: 'require',
          property: 'ensure',
        },
        {
          message: 'Please use import() instead',
          object: 'System',
          property: 'import',
        },
      ],
      'no-restricted-syntax': ['error', 'WithStatement'],
      '@stylistic/js/no-tabs': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'error',
      '@stylistic/js/no-trailing-spaces': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-setter-return': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-sync': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        },
      ],
      'no-unused-labels': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_(?:[0-9]+)?',
          destructuredArrayIgnorePattern: '^_(?:[0-9]+)?',
          ignoreRestSiblings: true,
        },
      ],
      'no-use-before-define': ['error', { functions: false }],
      'no-useless-backreference': 'error',
      '@stylistic/js/no-whitespace-before-property': 'error',
      'no-useless-call': 'error',
      '@stylistic/js/nonblock-statement-body-position': 'error',
      'no-useless-catch': 'error',
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      'no-useless-computed-key': 'error',
      '@stylistic/js/object-property-newline': [
        'error',
        { allowMultiplePropertiesPerLine: true },
      ],
      'no-useless-concat': 'error',
      '@stylistic/js/one-var-declaration-per-line': 'error',
      'no-useless-constructor': 'error',
      '@stylistic/js/operator-linebreak': ['error', 'before'],
      'no-useless-escape': 'error',
      '@stylistic/js/padded-blocks': ['error', 'never'],
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreExport: false,
          ignoreImport: false,
        },
      ],
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': ['error', { allowAsStatement: true }],
      'no-with': 'error',
      '@stylistic/js/quote-props': ['error', 'as-needed'],
      'object-shorthand': 'error',
      '@stylistic/js/quotes': [
        'error',
        'single',
        { allowTemplateLiterals: true, avoidEscape: true },
      ],
      'operator-assignment': 'error',
      '@stylistic/js/rest-spread-spacing': ['error', 'never'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      '@stylistic/js/semi': ['error', 'never'],
      'prefer-const': 'error',
      '@stylistic/js/semi-spacing': 'error',
      'prefer-destructuring': [
        'error',
        {
          AssignmentExpression: { array: false, object: false },
          VariableDeclarator: { array: true, object: true },
        },
        { enforceForRenamedProperties: false },
      ],
      '@stylistic/js/space-before-blocks': 'error',
      'prefer-object-spread': 'error',
      '@stylistic/js/space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never' },
      ],
      'prefer-promise-reject-errors': 'error',
      '@stylistic/js/space-in-parens': 'error',
      'prefer-rest-params': 'error',
      '@stylistic/js/space-infix-ops': 'error',
      'prefer-spread': 'error',
      '@stylistic/js/space-unary-ops': 'error',
      'prefer-template': 'error',
      '@stylistic/js/spaced-comment': [
        'error',
        'always',
        { exceptions: ['!'], markers: ['/'] },
      ],
      'require-atomic-updates': 'error',
      '@stylistic/js/template-curly-spacing': 'error',
      'require-yield': 'error',
      '@stylistic/js/template-tag-spacing': 'error',
      '@stylistic/js/wrap-iife': 'error',
      '@stylistic/js/yield-star-spacing': 'error',
      'sort-imports': 'off',
      // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
      'import/export': 'error',

      strict: ['error', 'never'],

      'symbol-description': 'error',

      'import/no-duplicates': 'error',

      'unicode-bom': ['error', 'never'],

      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],

      'use-isnan': 'error',

      // https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules
      'n/callback-return': ['error', ['callback', 'cb', 'next', 'done']],

      // https://eslint.org/blog/2018/11/jsdoc-end-of-life/
      'valid-jsdoc': 'off',

      'valid-typeof': ['error', { requireStringLiterals: true }],

      'vars-on-top': 'error',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    name: 'Typescript config',
    plugins: {
      '@stylistic/ts': stylisticTs,
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: {
      ...tsEslint.configs.strict[2].rules,
      ...tsEslint.configs.recommendedTypeChecked[2].rules,

      '@typescript-eslint/consistent-type-imports': 'error',

      '@stylistic/ts/member-delimiter-style': [
        2,
        {
          multiline: { delimiter: 'none', requireLast: false },
          multilineDetection: 'brackets',
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],

      // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
      'default-case': 'off',

      // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
      'no-dupe-class-members': 'off',

      '@typescript-eslint/no-invalid-void-type': 'off',

      'no-duplicate-imports': 'off',

      '@typescript-eslint/no-non-null-assertion': 'off',

      'no-shadow': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_(?:[0-9]+)?',
          destructuredArrayIgnorePattern: '^_(?:[0-9]+)?',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-use-before-define': ['error', { typedefs: false }],
      // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
      'no-undef': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      'no-use-before-define': 'off',
      'n/no-missing-import': 'off',

      'sort-imports': 'off',
      'n/no-unpublished-import': 'off',
    },
    settings: {
      'import/resolver': {
        project: './tsconfig.eslint.json',
      },
    },
  },

  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    name: 'React config',
    plugins: {
      '@stylistic/js': stylisticJs,
      'jsx-a11y': pluginJsxA11y,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      // http://eslint.org/docs/rules/
      '@stylistic/js/jsx-quotes': ['error', 'prefer-single'],

      // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
      // 'react/jsx-uses-react': 'error',
      // 'react/jsx-uses-vars': 'error',
      'react/forbid-foreign-prop-types': ['error', { allowInPropTypes: true }],
      'react/jsx-no-comment-textnodes': 'error',
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
      'jsx-a11y/alt-text': 'error',

      'react/jsx-no-duplicate-props': 'error',

      'react/jsx-no-target-blank': 'error',

      'jsx-a11y/anchor-has-content': 'error',

      // 'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': ['error', { allowAllCaps: true, ignore: [] }],

      'jsx-a11y/anchor-is-valid': [
        'error',
        { aspects: ['noHref', 'invalidHref'] },
      ],

      // 'react/react-in-jsx-scope': 'error',
      'react/jsx-sort-props': 'error',

      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',

      // 'react/style-prop-object': 'error',
      'react/no-did-update-set-state': 'error',

      'jsx-a11y/aria-props': 'error',

      'jsx-a11y/aria-proptypes': 'error',
      // 'react/no-danger-with-children': 'error',
      'react/no-is-mounted': 'error',
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
      'jsx-a11y/aria-unsupported-elements': 'error',
      'react/no-unknown-property': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',

      'react-hooks/exhaustive-deps': 'error',
      // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
      'react-hooks/rules-of-hooks': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  }
)
