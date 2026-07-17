export default defineNuxtConfig({
  srcDir: '..',

  // Tell the watcher to completely ignore these massive folders
  ignore: ['../.output/**', '../.nuxt/**', '../node_modules/**', '../dist/**', '../.git/**'],
});
