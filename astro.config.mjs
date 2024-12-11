// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  build: {
    format: 'directory', // Usa una opción válida como 'format'
  },
  server: {
    port: 4321, // Puerto de Astro
  },
  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1000, // Aumenta el límite de tamaño de chunk

    },
    resolve: {
      alias: {
        '@components': '/src/components',
        '@utils': '/src/utils',

      },
    },
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
  integrations: [tailwind(), react(), svelte()],
});