export default defineNuxtConfig({
  extends: [
    // Assuming this is how you are linking locally right now
    '../giftaway-site-frontend/export-layer',
  ],
  vite: {
    server: {
      watch: {
        // This explicitly tells Vite "do not watch node_modules or output
        // folders ANYWHERE on my hard drive"
        ignored: ['**/.output/**', '**/.nuxt/**', '**/node_modules/**'],
      },
    },
  },
});
