import { defineConfig } from 'vitepress';
// import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

import { guideConfig } from '../guide/guide.config';

export default defineConfig({
  title: 'Vue 3 Template',
  description: 'Plantilla base con Vue 3, Vite y TypeScript',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guía', link: '/guide/' },
      {
        text: 'GitHub',
        link: 'https://github.com/DevAngelCrow/vue-3-template',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Introducción',
          link: '/',
        },
      ],
      ...guideConfig.sidebar,
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
    server: {
      host: true,
    },
  },
});
