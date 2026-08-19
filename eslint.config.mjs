import nextConfig from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  ...nextConfig,
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
