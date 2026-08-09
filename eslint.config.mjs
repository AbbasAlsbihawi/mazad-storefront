import nextConfig from 'eslint-config-next';

const deepRelativeImport = {
  group: ['../../../*'],
  message: 'Use a path alias (@shared/, @features/, @app/) instead of a deep relative import.',
};

const architectureRules = [
  {
    name: 'mazad-storefront/features-are-isolated',
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@features/*', '@features/*/**', '@app/*', '@app/*/**'],
              message:
                'A feature may not import another feature or app/. Reach its own files with a relative import, or compose the two in a route file under src/app/.',
            },
            deepRelativeImport,
          ],
        },
      ],
    },
  },
  {
    name: 'mazad-storefront/shared-knows-nothing-about-features',
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@features/*', '@features/*/**', '@app/*', '@app/*/**'],
              message:
                'shared/ must never import from features/ or app/. If shared code needs feature data, invert the dependency and let the feature pass it in.',
            },
            deepRelativeImport,
          ],
        },
      ],
    },
  },
  {
    name: 'mazad-storefront/app-imports-public-api-only',
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@features/*/**'],
              message:
                "Import a feature's public API only (`@features/<name>`), never its internals.",
            },
            deepRelativeImport,
          ],
        },
      ],
    },
  },
];

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'next-env.d.ts'],
  },
  ...nextConfig,
  ...architectureRules,
  {
    name: 'mazad-storefront/general-rules',
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];

export default config;
