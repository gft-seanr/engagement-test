<script setup lang="ts">
import Logo from '../components/shared/Logo.vue';
</script>

<template>
  <div
    class="grid h-screen grid-cols-1 overflow-hidden bg-neutral-50 md:grid-cols-2 dark:bg-neutral-950"
  >
    <!-- Left Grid -->
    <div class="relative flex h-screen flex-col">
      <nav class="absolute top-0 left-0 z-10 p-4 sm:p-6">
        <!-- Logo -->
        <nuxt-link to="/admin" class="flex items-center gap-3" aria-label="Go to Dashboard">
          <Logo />
        </nuxt-link>
      </nav>

      <div class="max-w-auth-form mx-auto flex h-full w-full flex-col items-start justify-center">
        <slot />
      </div>
    </div>

    <!-- Right Grid - Hidden on mobile -->
    <div class="relative hidden h-screen w-full md:block">
      <div class="absolute top-20 flex w-full flex-col items-center justify-center">
        <h1
          class="font-heading text-2xl font-semibold text-neutral-700 md:text-4xl lg:text-5xl xl:text-6xl dark:text-neutral-100"
        >
          Build. Customize. Launch.
        </h1>
        <h3 class="font-display text-neutral-500 dark:text-neutral-400">
          Create and launch campaigns effortlessly.
        </h3>
      </div>
      <img
        src="https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/engagement/admin/Enggagement%20Admin%20Login.webp"
        alt="Giftaway Engagement Image"
        class="h-full w-full object-cover dark:grayscale dark:invert"
      />
    </div>
  </div>
</template>
