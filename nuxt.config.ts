// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import type { NuxtPage } from 'nuxt/schema';

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Giftaway',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  hooks: {
    'pages:extend'(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.path.startsWith('/campaign/')) {
            page.meta ||= {};
            // Note that this will override any middleware set in `definePageMeta` in the page
            page.meta.middleware = ['campaign'];
          }
          if (page.children) {
            setMiddleware(page.children);
          }
        }
      }
      setMiddleware(pages);
    },
  },
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/test-utils',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    'nuxt-gtag',
    '@nuxtjs/mdc',
    '@nuxtjs/color-mode',
    'motion-v/nuxt',
    '@pinia/nuxt',
  ],
  css: ['~/assets/styles/main.css', '~/assets/styles/transition.css'],
  imports: {
    dirs: ['composables/**', 'services/**', 'constants/**', 'utils/**', 'components/shared/**'],
  },
  vite: {
    // @ts-expect-error
    plugins: [tailwindcss()],
    vue: {
      script: {
        globalTypeFiles: [
          fileURLToPath(new URL('./types/components.ts', import.meta.url)),
          fileURLToPath(new URL('./types/programs.ts', import.meta.url)),
        ], // Add global types for vue files' auto-import of types.
      },
    },
  },
  extends: ['./admin'],
  components: [
    {
      path: '~/components/global/templates',
      prefix: '',
      global: true,
    },
    {
      path: '~/components/global/campaigns',
      prefix: '',
      global: true,
    },
    {
      path: '~/components/global/ui',
      prefix: '',
      global: true,
    },
    {
      path: '~/components/core',
      prefix: '',
    },
    {
      path: '~/components/shared',
      prefix: '',
    },
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */

    componentDir: './components/shadcn-ui',
  },
  mdc: {
    headings: {
      anchorLinks: {
        h1: false,
        h2: false,
        h3: false,
        h4: false,
        h5: false,
        h6: false,
      },
    },
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-H8F2GSENR0',
  },
  colorMode: {
    classSuffix: '',
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
});
