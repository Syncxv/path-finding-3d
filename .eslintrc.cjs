module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'svelte3'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		extraFileExtensions: ['.svelte']
	},
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3'
		}
	],
	env: {
		es6: true,
		browser: true
	},

	settings: {
		'svelte3/typescript': require('typescript'),
		'svelte3/ignore-styles': () => true
	},
	rules: {
		// "quotes": ["error", "double", { "avoidEscape": true }],
		'jsx-quotes': ['error', 'prefer-double'],
		'no-mixed-spaces-and-tabs': 'error',
		indent: [
			'error',
			'tab',
			{
				VariableDeclarator: 1,
				SwitchCase: 1
			}
		],
		'arrow-parens': ['error', 'as-needed'],
		'eol-last': ['error', 'always'],
		'func-call-spacing': ['error', 'never'],
		'no-multi-spaces': 'error',
		'no-trailing-spaces': 'error',
		'no-whitespace-before-property': 'error',
		semi: ['error', 'always'],
		'semi-style': ['error', 'last'],
		'space-in-parens': ['error', 'never'],
		'block-spacing': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		eqeqeq: [
			'error',
			'always',
			{
				null: 'ignore'
			}
		],
		'spaced-comment': [
			'error',
			'always',
			{
				markers: ['!']
			}
		],
		yoda: 'error',
		'prefer-destructuring': [
			'error',
			{
				object: true,
				array: false
			}
		],
		'operator-assignment': ['error', 'always'],
		'no-useless-computed-key': 'error',
		'no-unneeded-ternary': [
			'error',
			{
				defaultAssignment: false
			}
		],
		'no-invalid-regexp': 'error',
		'no-constant-condition': [
			'error',
			{
				checkLoops: false
			}
		],
		'no-duplicate-imports': 'error',
		'no-extra-semi': 'error',
		'consistent-return': [
			'warn',
			{
				treatUndefinedAsUnspecified: false
			}
		],
		'dot-notation': 'error',
		'no-useless-escape': ['error'],
		'no-fallthrough': 'error',
		'for-direction': 'error',
		'no-async-promise-executor': 'error',
		'no-cond-assign': 'error',
		'no-dupe-else-if': 'error',
		'no-duplicate-case': 'error',
		'no-irregular-whitespace': 'error',
		'no-loss-of-precision': 'error',
		'no-misleading-character-class': 'error',
		'no-prototype-builtins': 'error',
		'no-regex-spaces': 'error',
		'no-shadow-restricted-names': 'error',
		'no-unexpected-multiline': 'error',
		'no-unsafe-optional-chaining': 'error',
		'no-useless-backreference': 'error',
		'use-isnan': 'error',
		'prefer-const': 'error',
		'prefer-spread': 'error',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'unused-imports/no-unused-imports': 'error'
	}
};
