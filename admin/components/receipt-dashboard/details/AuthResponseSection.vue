<script setup lang="ts">
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';

interface Props {
  selectedEntry: ReceiptFileItem;
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-4">
    <h3 class="border-b border-gray-200 pb-2 text-lg font-semibold">Auth Response</h3>

    <div>
      <label class="mb-2 block text-sm font-bold">Description</label>
      <div
        class="min-h-[76px] w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900"
      >
        {{ selectedEntry.feedback || 'No feedback provided' }}
      </div>
    </div>
  </div>
</template>
