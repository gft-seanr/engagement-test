<script lang="ts" setup>
import { type FormKitSchemaDefinition } from '@formkit/core';
import { markRaw } from 'vue';
import { NuxtLink } from '#components';

const { schema, alert } = defineProps<{
  alert: {
    component: string;
    map: AlertMap<LoginErrorCode>;
    props?: Record<string, any>;
  };
  schema: FormKitSchemaDefinition;
}>();

const componentLibrary = markRaw({
  NuxtLink,
});

// login logic
const { handleLoginSuccess } = inject<{
  handleLoginSuccess: (data: LoginData | null) => void;
}>('login')!;

const { loginModel, isPending, isError, alerts, handleLogin } = useLoginMutation(
  handleLoginSuccess,
  alert?.map
);

// Exposes the login data for it to be used in the parent component
const sharedLoginModel = defineModel();

watch(
  loginModel,
  (newValue) => {
    if (newValue) {
      sharedLoginModel.value = newValue;
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="[&_*:last-child]:mb-0">
    <FormKit
      type="form"
      name="loginForm"
      id="loginForm"
      :incomplete-message="false"
      :actions="false"
      :disabled="isPending"
      v-model="loginModel"
      #default="{ disabled, state }"
      @submit="handleLogin"
    >
      <component
        v-if="isError && alerts"
        :is="alert.component"
        :alerts="alerts"
        v-bind.props="{ ...alert.props }"
        class="mb-4"
      >
      </component>

      <FormKitSchema
        v-if="schema"
        :schema="schema"
        :data="{ disabled, state, isPending }"
        :library="componentLibrary"
      />
    </FormKit>
  </div>
</template>
