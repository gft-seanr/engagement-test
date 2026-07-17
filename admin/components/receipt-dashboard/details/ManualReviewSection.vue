<script setup lang="ts">
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';
import { DecisionStatus } from '~/admin/types/receipt-dashboard';

interface Props {
  editFormData: ReceiptFileItem;
}

interface Emits {
  (event: 'update-feedback', value: string): void;
  (event: 'handle-decision', statusId: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="space-y-4 border-t border-gray-200 pt-6">
    <h3 class="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
      Manual Review Decision
    </h3>

    <div>
      <FormKit
        type="textarea"
        label="Decision Reason"
        name="feedback"
        :label-class="'$reset font-bold text-sm'"
        :model-value="editFormData?.feedback || ''"
        @input="emit('update-feedback', $event as string)"
        :rows="3"
        input-class="dark:!text-black !font-normal !text-sm"
        help="Please provide a reason for your decision."
        :help-class="'dark:!text-black'"
      />
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <Button
        variant="destructive"
        size="lg"
        @click="emit('handle-decision', DecisionStatus.REJECT)"
        class="cursor-pointer px-8 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
      >
        REJECT
      </Button>
      <Button
        variant="default"
        size="lg"
        @click="emit('handle-decision', DecisionStatus.APPROVE)"
        class="cursor-pointer bg-green-500 px-8 text-white hover:bg-green-600"
      >
        APPROVE
      </Button>
    </div>
  </div>
</template>
