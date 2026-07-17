<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { EyeClosed, Eye } from 'lucide-vue-next';
import PageTitle from '~/admin/components/shared/PageTitle.vue';
import LogoLoader from '~/admin/components/shared/LogoLoader.vue';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

const { setLoginData } = useAuthStore();
const route = useRoute();

const currentProjectId = route.params.campaignId as string;

const { projectConfig, handleLoginSuccess } = useAdminAuth(currentProjectId);

const loginRequest = ref<AdminLoginParams>({
  id: currentProjectId,
  email: '',
  password: '',
  code: '',
});

const showPassword = ref(false);

const { isPending, isError, error, mutate } = useMutation({
  mutationFn: (request: AdminLoginParams) => login(request),
  onSuccess: ({ data }) => {
    if (!data) return;

    setLoginData(data);

    handleLoginSuccess(data);
  },
  onError: (error) => {
    console.error('Login error:', error);
  },
});

const handleLogin = () => {
  mutate(loginRequest.value);
};

const handleIconClick = () => {
  showPassword.value = !showPassword.value;
};

const errorMessage = computed(() => {
  if (!error.value) return '';

  if (Array.isArray(error.value)) {
    return error.value[0]?.description || 'An error occurred during login. Please try again.';
  }

  return 'An error occurred during login. Please try again.';
});
</script>

<template>
  <div class="mx-auto w-full max-w-sm px-4 sm:px-6 md:max-w-md lg:max-w-lg">
    <PageTitle :title="`Log in to ${projectConfig?.name || 'Admin'}`" />

    <Alert v-if="!isPending && isError" class="mb-6 border-red-500 bg-red-100 text-red-500">
      <AlertDescription class="text-red-500">
        {{ errorMessage }}
      </AlertDescription>
    </Alert>

    <client-only>
      <FormKit
        v-model="loginRequest"
        type="form"
        submit-label="Log In"
        @submit="handleLogin"
        :actions="false"
        form-class="flex w-full flex-col gap-5"
        :incomplete-message="false"
      >
        <FormKit
          type="email"
          name="email"
          label="Email Address"
          validation="required|email"
          placeholder="user@giftaway.ph"
          label-class="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-neutral-100"
          input-class="text-sm"
        />

        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Password
            </label>
            <NuxtLink
              :to="`/admin/${$route.params.campaignId}/forgot-password`"
              class="text-xs font-medium text-purple-600 transition-colors hover:text-purple-700 hover:underline"
            >
              Forgot Password?
            </NuxtLink>
          </div>

          <FormKit
            :type="showPassword ? 'text' : 'password'"
            name="password"
            validation="required"
            placeholder="•••••••••"
            label-class="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-neutral-100"
            input-class="text-sm"
            inner-class="relative"
          >
            <template #suffixIcon>
              <button
                type="button"
                @click="handleIconClick"
                class="absolute top-1/2 right-3 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-600"
                aria-label="Toggle password visibility"
              >
                <Eye v-if="showPassword" :size="16" />
                <EyeClosed v-else :size="16" />
              </button>
            </template>
          </FormKit>
        </div>

        <Button
          :is-loading="isPending"
          :disabled="isPending"
          class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-600 p-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-700 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
        >
          <LogoLoader v-if="isPending" class="size-5 text-white" />

          <span>{{ isPending ? 'Logging in...' : 'Log In' }}</span>
        </Button>
      </FormKit>
    </client-only>
  </div>
</template>
