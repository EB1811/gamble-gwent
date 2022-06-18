import {svelte} from '@sveltejs/vite-plugin-svelte'
import postcss from './postcss.config.js'
import {defineConfig} from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss
  },
  define: {
    'import.meta.vitest': 'undefined'
  },
  test: {
    includeSource: ['src/**/*.{js,ts}']
  }
})
