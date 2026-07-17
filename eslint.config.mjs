// eslint.config.mjs
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt()
  // 2. Add your custom overrides here
  .override('nuxt/vue/rules', {
    rules: {
      // Allow single-word component names in strict contexts (optional)
      'vue/multi-word-component-names': 'off',

      // Enforce specific ordering of tags in .vue files
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      // Enforce self-closing tags for cleaner code
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
        },
      ],
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
      // Warn if you leave a console.log in production code
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // Prevent unused variables (but allow _unused for ignored vars)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  });
