/** @type {import('tailwindcss').Config} */

import primeui from "tailwindcss-primeui"
export default {
  content: ['./src/**/*.{vue,js,ts}',
    './docs/**/*.md',
    './docs/.vitepress/theme/**/*.{js,ts,vue}', "./index.html"],
    theme:{extend:{}},
    plugins: [primeui]
};