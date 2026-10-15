import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    globals: true,
    // Role queries are slow in jsdom; with many workers starting at once
    // (the workstation has 64 threads) a file's first test can exceed 5s.
    testTimeout: 15_000,
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', '**/.design-sync/**', '**/.ds-sync/**']
  }
});
