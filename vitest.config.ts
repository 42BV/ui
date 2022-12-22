/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'setupTests.ts', 'src/test/']
    }
  }
});
