import { fixupConfigRules } from '@eslint/compat';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat, Legacy as vitestGlobals } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [{
  files: ['src/**/*.{js,jsx,ts,tsx}'],
  ignores: ['**/node_modules/', '**/dist/'],
}, ...fixupConfigRules(compat.extends(
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react/jsx-runtime',
  'plugin:react-hooks/recommended',
  'plugin:vitest-globals/recommended',
)), {
  plugins: {
    'react-refresh': reactRefresh,
  },
  languageOptions: {
    globals: {
      // Safeguard against undefined globals
      ...globals.browser || {},
      ...(vitestGlobals.environments?.env?.globals || {}),
    },

    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  settings: {
    react: {
      version: '18.2',
    },
  },

  rules: {
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true,
    }],

    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],

    'arrow-spacing': ['error', {
      before: true,
      after: true,
    }],

    'no-console': 0,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'no-unused-vars': 0,
  },
}];
