// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

import mdx from '@astrojs/mdx';

import { fileURLToPath, URL } from "node:url";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
      title: 'My Docs',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
      customCss: ["./src/styles/global.css"],
      sidebar: [
          {
              label: 'Guides',
              items: [
                  // Each item here is one entry in the navigation menu.
                  { label: 'Example Guide', slug: 'guides/example' },
              ],
          },
          {
              label: 'Reference',
              autogenerate: { directory: 'reference' },
          },
      ],
  }), vue(), mdx()],

  vite: {
    resolve: {
        alias: {
            "@main":fileURLToPath(new URL("../src", import.meta.url))
        }
    },
    plugins: [tailwindcss()],
  },
});