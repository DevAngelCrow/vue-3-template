import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Vue 3 Template',
  description: 'Plantilla base con Vue 3, Vite y TypeScript',
  themeConfig: {
    nav: [
      { text: 'Guía', link: '/guide/' },
      {
        text: 'GitHub',
        link: 'https://github.com/DevAngelCrow/vue-3-template',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guía',
          items: [
            { text: 'Introducción', link: '/guide/' },
            { text: 'Estructura del Proyecto', link: '/guide/estructura' },
            { text: 'Composición y Componentes', link: '/guide/componentes' },
            { text: 'Buenas Prácticas', link: '/guide/practicas' },
          ],
        },
      ],
    },
  },
});
