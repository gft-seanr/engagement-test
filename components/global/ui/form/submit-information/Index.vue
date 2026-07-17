<script lang="ts" setup>
import { type FormKitSchemaDefinition } from '@formkit/core';
import { Icon } from '#components';

const { schema, alert } = defineProps<{
  alert: {
    component: string;
    map: AlertMap<SubmitInformationErrorCode>;
    props?: Record<string, any>;
  };
  schema: FormKitSchemaDefinition;
}>();

const { handleSubmitSuccess } = inject<{
  handleSubmitSuccess: () => void;
}>('submit')!;

const { submitInfoData, isPending, isError, handleSubmit, alerts } = useSubmitInformationMutation(
  handleSubmitSuccess,
  alert.map
);

// Preload specific alert component for offline functionality
preloadAlertComponents();
const isLoading = ref(false);

const componentLibrary = markRaw({
  Icon,
});
</script>
<template>
  <div class="[&_*:last-child]:mb-0">
    <FormKit
      type="form"
      id="submitForm"
      name="submitForm"
      v-model="submitInfoData"
      :incomplete-message="false"
      :actions="false"
      :disabled="isLoading"
      @submit="handleSubmit"
      #default="{ disabled, state }"
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
        :data="{ disabled: disabled || isPending, state, isPending }"
        :library="componentLibrary"
      />
    </FormKit>
  </div>
</template>
