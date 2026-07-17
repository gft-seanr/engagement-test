<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
const { loginData, isPending, isError, error, handleSubmit } = useLogin();

function useLogin() {
  const loginData = ref({});
  const route = useRoute();

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: (params: any) => login(params),
    onSuccess: async () => {
      await navigateTo(`/admin/${route.params.id}/`);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  function handleSubmit() {
    mutate({
      ...loginData.value,
      id: route.params.id,
    });
  }

  return {
    loginData,
    isPending,
    isError,
    error,
    handleSubmit,
  };
}

const formSchema = [
  {
    $el: 'h1',
    children: 'Admin',
    attrs: {
      class: 'text-2xl font-bold mb-4',
    },
  },
  {
    $formkit: 'text',
    name: 'email',
    label: 'Email',
    validation: 'required|email',
  },
  {
    $formkit: 'password',
    name: 'password',
    label: 'Password',
    validation: 'required',
  },
  {
    $formkit: 'submit',
    type: 'submit',
    label: 'Log in',
    disabled: '$disabled',
    children: {
      if: '$disabled',
      then: {
        $el: 'span',
        attrs: {
          class:
            'w-6 h-6 border-2 border-surface-1 border-r-transparent mr-2 rounded-full animate-spin',
        },
      },
      else: '$label',
    },
  },
];
</script>
<template>
  <NuxtLayout name="centered-compact">
    <div class="'flex ease-in-out' flex-col gap-8 px-6 py-10">
      <div class="[&_*:last-child]:mb-0">
        <FormKit
          type="form"
          v-model="loginData"
          ref="formRef"
          :incomplete-message="false"
          :actions="false"
          @submit="handleSubmit"
          :disabled="isPending"
          #default="{ disabled }"
        >
          <alert-card
            v-if="isError"
            :alerts="[DEFAULT_LOGIN_ALERT.InvalidUserPassword]"
            class="mb-4"
          >
          </alert-card>

          <FormKitSchema :schema="formSchema" :data="{ disabled }" />
        </FormKit>
      </div>
    </div>
  </NuxtLayout>
</template>
