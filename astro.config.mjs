import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jaestudio.pages.dev',
  output: 'static',
  build: {
    format: 'directory'
  }
});
