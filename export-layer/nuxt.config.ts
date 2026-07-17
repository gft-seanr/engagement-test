import { fileURLToPath } from 'node:url';

// This dynamically grabs the absolute path of the parent directory
// no matter where Nuxt caches it on your machine.
const parentDir = fileURLToPath(new URL('..', import.meta.url));

export default defineNuxtConfig({
  components: [{ path: `${parentDir}/components`, pathPrefix: false, global: true }],
  imports: {
    dirs: [`${parentDir}/composables`, `${parentDir}/utils`, `${parentDir}/types`],
  },
  alias: {
    '~': parentDir,
    '@': parentDir,
    '~~': parentDir,
    '@@': parentDir,
  },
  // If you also want to share server/utils or server/api routes, uncomment this:
  // serverDir: `${parentDir}/server`
});
