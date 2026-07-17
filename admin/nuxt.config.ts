import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  components: [{ path: './components', prefix: 'Builder' }],
  imports: {
    dirs: ['composables', 'composables/**', 'utils', 'utils/**', 'stores'],
  },
  alias: {
    '~admin': fileURLToPath(new URL('./', import.meta.url)),
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
      },
    },
  },
});
