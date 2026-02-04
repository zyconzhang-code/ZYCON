import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: '/',
  publicDir: 'assets',
  define: {
    __DEV__: JSON.stringify(mode !== 'production')
  }
}));
