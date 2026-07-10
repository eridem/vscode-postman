import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.ts'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsparser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'import',
                    format: ['camelCase', 'PascalCase'],
                },
            ],
            curly: 'off',
            eqeqeq: 'off',
            'no-throw-literal': 'warn',
            semi: 'off',
        },
    },
    {
        ignores: ['dist/**', 'out/**', 'node_modules/**', 'esbuild.js'],
    },
];
