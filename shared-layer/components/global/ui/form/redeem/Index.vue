<script lang="ts" setup>
import { type FormKitSchemaDefinition } from '@formkit/core';

const { schema, alert } = defineProps<{
  alert: {
    component: string;
    map: AlertMap<RedeemTokenErrorCode>;
    props?: Record<string, any>;
  };
  schema: FormKitSchemaDefinition;
}>();

const { handleRedeemSuccess } = inject<{
  handleRedeemSuccess: () => void;
}>('redeem')!;

const { redeemData, isPending, isError, handleRedeem, alerts } = useRedeemMutation(
  handleRedeemSuccess,
  alert.map
);

// Preload specific alert component for offline functionality
preloadAlertComponents();
</script>
<template>
  <div class="[&_*:last-child]:mb-0">
    <FormKit
      type="form"
      id="redeemform"
      name="redeemform"
      v-model="redeemData"
      :incomplete-message="false"
      :actions="false"
      :disabled="isPending"
      @submit="handleRedeem"
      #default="{ disabled }"
    >
      <component
        v-if="isError && alerts"
        :is="alert.component"
        :alerts="alerts"
        v-bind.props="{ ...alert.props }"
        class="mb-4"
      >
      </component>

      <FormKitSchema v-if="schema" :schema="schema" :data="{ disabled }" />
    </FormKit>
  </div>
</template>
