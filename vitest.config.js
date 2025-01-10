import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.vitest.spec.js', '**/*.vitest.spec.jsx'],
    environment: 'jsdom',
    globals: true,
  },
});