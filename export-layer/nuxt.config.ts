// export-layer/nuxt.config.ts
export default defineNuxtConfig({
  components: [
    // Reach up to the main repo's components folder
    { path: '../components', pathPrefix: false, global: true },
  ],
  imports: {
    // Reach up to your composables and types
    dirs: ['../composables', '../utils', '../types'],
  },
  alias: {
    // Fixes the Vue compiler "extends base type" error by telling it
    // where the root of the project is inside the downloaded cache
    '~': '..',
    '@': '..',
  },
});
