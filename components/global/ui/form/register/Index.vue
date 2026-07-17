<script lang="ts" setup>
import { type FormKitSchemaDefinition } from '@formkit/core';
import { markRaw } from 'vue';
import { NuxtLink } from '#components';

// Exposes the login data to use in the parent component
const sharedRegisterModel = defineModel();

const { schema, alert } = defineProps<{
  alert: {
    component: string;
    map: AlertMap<RegisterErrorCode>;
    props?: Record<string, any>;
  };
  schema: FormKitSchemaDefinition;
}>();

// register logic
const { handleRegisterSuccess } = inject<{
  handleRegisterSuccess: (data: RegisterData | null) => void;
}>('register')!;

const { registerModel, isPending, isError, handleRegister, alerts } = useRegisterMutation(
  handleRegisterSuccess,
  alert.map
);

const componentLibrary = markRaw({
  NuxtLink,
});

watch(
  registerModel,
  (newValue) => {
    if (newValue) {
      sharedRegisterModel.value = newValue;
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="[&_*:last-child]:mb-0">
    <FormKit
      type="form"
      id="registerform"
      name="registerform"
      v-model="registerModel"
      :incomplete-message="false"
      :actions="false"
      :disabled="isPending"
      @submit="handleRegister"
      #default="{ disabled, state }"
    >
      <component
        v-if="isError && alerts"
        :is="alert.component || 'alert-card'"
        :alerts="[alerts[0]]"
        v-bind.props="{ ...alert.props }"
        class="mb-4"
      >
      </component>
      <FormKitSchema
        :schema="schema"
        :data="{ disabled, state, isPending }"
        :library="componentLibrary"
      />
    </FormKit>
  </div>
</template>
