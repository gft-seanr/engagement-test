<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';

definePageMeta({
  name: 'campaign-builder-login',
  layout: false,
});

interface LoginApiParams extends LoginParams {
  id: string;
}

const CAMPAIGN_ID = 'B38613D8-9522-4CA0-8475-3352C667E00E';

const {
  isPending,
  isError,
  error,
  mutate: onLogin,
} = useMutation({
  mutationFn: (payload: LoginApiParams) => login(payload),
  onSuccess: async () => {
    await navigateTo({ name: 'admin-campaign-builder-dashboard' });
  },
  onError: (err: any) => {
    console.error('Login Failed:', err.message);
  },
});

function handleLogin(formData: LoginParams) {
  onLogin({
    ...formData,
    id: CAMPAIGN_ID,
  });
}
</script>
<template>
  <div class="min-h-dvh bg-white antialiased dark:bg-gray-900">
    <div
      v-if="isPending"
      class="fixed inset-0 z-50 grid place-items-center bg-white/50 backdrop-blur-sm dark:bg-gray-900/50"
    >
      <div class="loader-container perspective-[1000px]">
        <div class="loader">
          <svg
            width="56"
            height="56"
            viewBox="0 0 28 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="drop-shadow-xl"
          >
            <rect x="1.25714" y="9.4856" width="24.9143" height="8.22857" fill="white" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.149477 0.748813C0 1.04218 0 1.42621 0 2.19429L3.94515e-05 30.7119C4.12115e-05 31.8927 0.911681 32.4614 2.74155 31.5483C4.57143 30.6353 12.6857 26.7146 13.0286 26.5529C13.3714 26.3912 13.4857 26.3723 13.7143 26.3723C13.9429 26.3723 14.0571 26.3912 14.4 26.5529C14.7429 26.7146 22.8571 30.6353 24.687 31.5483C26.5169 32.4614 27.4285 31.8927 27.4285 30.7119L27.4286 2.19429C27.4286 1.42621 27.4286 1.04218 27.2791 0.748813C27.1476 0.490762 26.9378 0.28096 26.6798 0.149477C26.3864 0 26.0024 0 25.2343 0H13.7143H2.19429C1.42621 0 1.04218 0 0.748813 0.149477C0.490762 0.28096 0.28096 0.490762 0.149477 0.748813ZM21.193 10.8571C17.2522 14.6628 10.1889 14.6628 6.24809 10.8571L4.20572 12.9721C9.28588 17.8779 18.1553 17.8779 23.2354 12.9721L21.193 10.8571Z"
              fill="#A263F0"
            />
          </svg>
        </div>
      </div>
    </div>
    <main class="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2">
      <section class="flex flex-col [--header-height:5rem]">
        <header class="h-[var(--header-height)] shrink-0">
          <div class="flex h-full w-full items-center px-6 md:px-8">
            <div class="flex items-center gap-1.5">
              <svg
                width="28"
                height="32"
                viewBox="0 0 28 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1.25714" y="9.4856" width="24.9143" height="8.22857" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.149477 0.748813C0 1.04218 0 1.42621 0 2.19429L3.94515e-05 30.7119C4.12115e-05 31.8927 0.911681 32.4614 2.74155 31.5483C4.57143 30.6353 12.6857 26.7146 13.0286 26.5529C13.3714 26.3912 13.4857 26.3723 13.7143 26.3723C13.9429 26.3723 14.0571 26.3912 14.4 26.5529C14.7429 26.7146 22.8571 30.6353 24.687 31.5483C26.5169 32.4614 27.4285 31.8927 27.4285 30.7119L27.4286 2.19429C27.4286 1.42621 27.4286 1.04218 27.2791 0.748813C27.1476 0.490762 26.9378 0.28096 26.6798 0.149477C26.3864 0 26.0024 0 25.2343 0H13.7143H2.19429C1.42621 0 1.04218 0 0.748813 0.149477C0.490762 0.28096 0.28096 0.490762 0.149477 0.748813ZM21.193 10.8571C17.2522 14.6628 10.1889 14.6628 6.24809 10.8571L4.20572 12.9721C9.28588 17.8779 18.1553 17.8779 23.2354 12.9721L21.193 10.8571Z"
                  fill="#A263F0"
                />
              </svg>
              <span class="font-heading text-4xl font-semibold text-black dark:text-white">
                Giftaway
              </span>
              <span
                class="hidden font-heading text-4xl font-semibold text-[#a3a3a3] xs:inline dark:text-neutral-500"
              >
                Engagement
              </span>
            </div>
          </div>
        </header>

        <div class="flex grow flex-col justify-center px-6 py-8 md:px-8 lg:py-0">
          <div class="mx-auto w-full max-w-md">
            <div class="grid auto-rows-min gap-8">
              <div class="space-y-2">
                <h1
                  class="font-heading text-3xl font-bold text-gray-900 md:text-5xl dark:text-white"
                >
                  Log in
                </h1>
                <p class="text-sm text-[#525252] dark:text-neutral-400">
                  Enter your details to log in.
                </p>
              </div>

              <alert-component-2
                v-if="isError"
                :alerts="[defaultLoginAlert.InvalidUserPassword]"
                :classes="{
                  title: 'text-sm font-bold text-red-800 dark:text-red-400',
                  description: 'mt-1 text-sm text-red-700 dark:text-red-300',
                  icon: 'size-5 text-red-500 dark:text-red-400 shrink-0',
                }"
              />
              <form-kit
                id="loginForm"
                type="form"
                name="loginForm"
                :incomplete-message="false"
                :actions="false"
                @submit="handleLogin"
              >
                <form-kit
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="example@email.com"
                  validation="required | email"
                  :classes="{
                    input: 'font-normal text-sm',
                  }"
                />
                <form-kit
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  validation="required | password"
                  :classes="{
                    input: 'font-normal text-sm',
                  }"
                />
                <form-kit type="submit" label="Log In" />
              </form-kit>
            </div>
          </div>
        </div>
      </section>

      <section
        class="relative hidden grid-rows-[auto_1fr] overflow-hidden bg-[#f5f5f5] lg:grid dark:bg-gray-800"
      >
        <div class="relative z-30 container grid place-items-center px-8 py-14">
          <h2 class="font-heading text-5xl font-bold text-gray-900 dark:text-white">
            Build. Customize. Launch
          </h2>

          <p class="font-heading text-sm text-gray-600 dark:text-gray-400">
            Create and launch campaigns effortlessly.
          </p>
        </div>

        <div class="absolute top-1/2 -left-6 z-20 -translate-y-1/3 transform">
          <nuxt-img
            src="/guy-rocket.png"
            format="png"
            class="relative dark:brightness-50 dark:invert"
            alt="Man on a rocket"
          />
          <nuxt-img
            src="/component-box.png"
            class="absolute top-0 -right-10 h-auto w-40 rotate-10 transform"
            format="png"
            alt="Floating UI component"
          />
        </div>
        <nuxt-img
          src="/bg.png"
          class="absolute bottom-0 z-10 h-full min-h-0 w-full object-cover dark:brightness-75"
          alt="Campaign Builder Login Illustration"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.loader {
  animation: rotateLoading 3s cubic-bezier(0.85, 0, 0.15, 1) infinite;
  transform-style: preserve-3d;
}

@keyframes rotateLoading {
  0% {
    transform: rotateX(0) rotateY(0) rotateZ(0);
  }

  30% {
    transform: rotateX(180deg) rotateY(0) rotateZ(0);
  }
  33% {
    transform: rotateX(180deg) rotateY(0) rotateZ(0);
  }
  63% {
    transform: rotateX(180deg) rotateY(180deg) rotateZ(0);
  }
  66% {
    transform: rotateX(180deg) rotateY(180deg) rotateZ(0);
  }

  96% {
    transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg);
  }
  100% {
    transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg);
  }
}
</style>
