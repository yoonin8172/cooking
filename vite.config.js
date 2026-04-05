import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cooking/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    strictPort: true,
  },
});
