// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  server: {
    port: 4321, // Puerto de Astro
  },
  vite: {
    server: {
      proxy: {
        '/auth': {
          target: 'http://localhost:5000', // Backend de autenticación
          changeOrigin: true,
        },
        '/api': {
          target: 'http://localhost:5000', // Backend de subida de archivos
          changeOrigin: true,
        },
      },
    },
  },
  integrations: [tailwind()],
});