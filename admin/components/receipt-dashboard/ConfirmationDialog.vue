<script setup lang="ts">
interface Props {
  open: boolean;
  pendingDecision: { statusId: number; patchData: any; action: string } | null;
  isPatchPending: boolean;
  isPatchError: boolean;
  patchErrors: any;
  resetPatchTransaction: () => void;
}

interface Emits {
  (event: 'update:open', value: boolean): void;
  (event: 'confirm'): void;
  (event: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const closeDialog = () => {
  props.resetPatchTransaction();
  emit('update:open', false);
};

const confirmDecision = () => {
  emit('confirm');
};

const cancelDecision = () => {
  emit('cancel');
};
</script>

<template>
  <Dialog :open="open" @update:open="closeDialog">
    <DialogContent class="max-w-2xl bg-neutral-50">
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to {{ pendingDecision?.action?.toLowerCase() }} this submission?
        </DialogTitle>
        <DialogDescription class="text-black">
          Please review the data below before confirming your decision.
        </DialogDescription>
      </DialogHeader>

      <div class="max-h-96 space-y-4 overflow-y-auto rounded-md border border-gray-200 p-4">
        <div v-if="pendingDecision?.patchData" class="space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold text-gray-600">ID:</label>
              <p class="text-sm">{{ pendingDecision.patchData.id }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Hash:</label>
              <p class="text-sm break-all">{{ pendingDecision.patchData.hash }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Status:</label>
              <p class="text-sm">
                {{ pendingDecision.action }} ({{ pendingDecision.patchData.decisionStatusId }})
              </p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Invoice Number:</label>
              <p class="text-sm">{{ pendingDecision.patchData.invoiceNumber || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Store Name:</label>
              <p class="text-sm">{{ pendingDecision.patchData.storeName || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600">Store ID:</label>
              <p class="text-sm">{{ pendingDecision.patchData.storeId || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-semibold text-gray-600">Receipt Date & Time:</label>
              <p class="text-sm">{{ pendingDecision.patchData.receiptDateTime || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-semibold text-gray-600">Feedback:</label>
              <p class="text-sm">
                {{ pendingDecision.patchData.feedback || 'No feedback provided' }}
              </p>
            </div>
          </div>

          <div v-if="pendingDecision.patchData.products?.length">
            <label class="text-sm font-semibold text-gray-600">Products:</label>
            <div class="mt-2 space-y-2">
              <div
                v-for="(product, index) in pendingDecision.patchData.products"
                :key="index"
                class="flex justify-between rounded bg-gray-50 p-2 text-sm"
              >
                <span>{{ product.name }}</span>
                <span class="font-medium">Qty: {{ product.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="isPatchError" class="rounded-md border border-red-200 bg-red-50 p-4">
        <div class="flex items-center">
          <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500" />
          <h4 class="ml-2 text-sm font-medium text-red-800">Error occurred</h4>
        </div>
        <div class="mt-2 text-sm text-red-700">
          {{ patchErrors?.[0].description || 'Failed to process the request. Please try again.' }}
        </div>
      </div>

      <!-- Loading Message -->
      <div v-if="isPatchPending" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <div class="flex items-center">
          <Icon name="lucide:loader-2" class="h-5 w-5 animate-spin text-blue-500" />
          <h4 class="ml-2 text-sm font-medium text-blue-800">
            Processing {{ pendingDecision?.action?.toLowerCase() }}...
          </h4>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="cancelDecision"
          :disabled="isPatchPending"
          class="dark:!border-gray-200 dark:!bg-white dark:!text-gray-900 dark:hover:!bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          :variant="pendingDecision?.action === 'Approve' ? 'default' : 'destructive'"
          @click="confirmDecision"
          :disabled="isPatchPending"
          :class="[
            pendingDecision?.action === 'Approve'
              ? 'bg-green-500 hover:bg-green-600 dark:!bg-green-500 dark:hover:!bg-green-600'
              : 'dark:!bg-red-600 dark:hover:!bg-red-700',
            'text-white',
          ]"
        >
          <Icon v-if="isPatchPending" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          {{ isPatchPending ? 'Processing...' : `Confirm ${pendingDecision?.action}` }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
