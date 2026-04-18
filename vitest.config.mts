import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    setupFiles: [
      path.resolve(__dirname, './node_modules/@stacks/clarinet-sdk/vitest-helpers/src/clarityValuesMatchers.ts'),
    ],
    environment: 'node',
  },
});
