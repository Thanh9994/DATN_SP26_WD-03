import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
      },
    }),
    tsconfigPaths(),
  ],

  cacheDir: 'node_modules/.vite',

  server: {
    port: 5173,
    strictPort: true,

    fs: {
      allow: ['../..'],
    },

    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', '@tanstack/react-query', 'antd', '@ant-design/icons'],
    esbuildOptions: {
      target: 'es2020',
    },
  },

  build: {
    target: 'esnext',
  },
});
