<script setup lang="ts">
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';
import { DecisionStatus } from '~/admin/types/receipt-dashboard';
import { mapEditFormDataToPatchData } from '~/admin/utils/helpers';
import { usePatchTransactionMutation } from '~/admin/composables/mutations/usePatchTransactionMutation';
import TransactionsTable from '~/admin/components/receipt-dashboard/TransactionsTable.vue';
import DetailsContent from '~/admin/components/receipt-dashboard/DetailsContent.vue';
import ConfirmationDialog from '~/admin/components/receipt-dashboard/ConfirmationDialog.vue';

definePageMeta({
  name: 'spam-club-dashboard',
  layout: 'dashboard',
  middleware: ['admin', 'entry'],
});

const route = useRoute();
const router = useRouter();

// Initialize mutation for patching spam club transactions
const {
  patchResponse,
  isPatchPending,
  isPatchError,
  patchErrors,
  mutatePatchTransaction,
  mutatePatchTransactionAsync,
  resetPatchTransaction,
} = usePatchTransactionMutation();

const selectedId = computed(() => route.query.id as string);

// Dynamic breadcrumbs based on selection
const selectedEntry = ref<ReceiptFileItem | null>(null);
// Form data for editing
const editFormData = ref<ReceiptFileItem | null>(null);
const showProductsCollapsed = ref(true);

// Confirmation dialog state
const showConfirmationDialog = ref(false);
const pendingDecision = ref<{ statusId: number; patchData: any; action: string } | null>(null);

const dynamicBreadcrumbs = computed(() => {
  const baseBreadcrumbs = [
    { label: 'Admin', to: `/admin/${route.params.campaignId}` },
    { label: 'SPAM Club', to: `/admin/${route.params.campaignId}/spam-club` },
    { label: 'Dashboard', to: `/admin/${route.params.campaignId}/spam-club/dashboard` },
  ];

  if (selectedEntry.value) {
    baseBreadcrumbs.push({
      label: selectedEntry.value.id,
      to: `/admin/spam-club/${selectedEntry.value.id}`,
    });
  }
  return baseBreadcrumbs;
});

// Update breadcrumbs reactively
watch(
  dynamicBreadcrumbs,
  (newBreadcrumbs) => {
    // Update the route meta
    if (route.meta) {
      route.meta.breadcrumbs = newBreadcrumbs;
    }
  },
  { immediate: true }
);

// Initialize form data when entry is selected
watch(
  selectedEntry,
  (entry, previousEntry) => {
    // Only reset editFormData if we're actually selecting a different entry
    // Don't reset if we're staying on the same entry (which would overwrite user edits)
    if (entry && (!previousEntry || entry.id !== previousEntry.id)) {
      editFormData.value = entry;
    } else if (!entry) {
      editFormData.value = null;
    }
  },
  { immediate: true }
);

const selectEntry = (entry: ReceiptFileItem) => {
  selectedEntry.value = entry;
  router.push({
    path: route.path,
    query: { ...route.query, id: entry.id },
  });
};

const clearSelection = () => {
  selectedEntry.value = null;
  editFormData.value = null;

  // Remove id from query params
  const newQuery = { ...route.query };
  delete newQuery.id;

  router.replace({
    path: route.path,
    query: newQuery,
  });
};

const updateEditFormData = (newData: ReceiptFileItem) => {
  editFormData.value = newData;
};

const handleDecision = (statusId: number) => {
  if (!selectedEntry.value || !editFormData.value) return;

  // Map editFormData to ReceiptTransactionsPatchData
  const patchData = mapEditFormDataToPatchData(
    editFormData.value,
    route.params.campaignId as string,
    statusId
  );

  // Determine action type
  const action = statusId === DecisionStatus.APPROVE ? 'Approve' : 'Reject';

  // Store pending decision and show confirmation dialog
  pendingDecision.value = { statusId, patchData, action };
  showConfirmationDialog.value = true;
};

const confirmDecision = async () => {
  if (!pendingDecision.value) return;

  try {
    // Call the mutation with patch data
    await mutatePatchTransactionAsync(pendingDecision.value.patchData);

    // Reset the mutation state and close dialog
    resetPatchTransaction();
    showConfirmationDialog.value = false;
    pendingDecision.value = null;

    // Clear selection after successful operation
    clearSelection();
    // Reload the page after clearing selection
    window.location.reload();
  } catch (error) {
    console.error('Patch transaction failed:', error);
  }
};

const cancelDecision = () => {
  resetPatchTransaction();
  showConfirmationDialog.value = false;
  pendingDecision.value = null;
};

const handleDialogClose = () => {
  resetPatchTransaction();
  showConfirmationDialog.value = false;
};
</script>

<template>
  <div class="flex h-full w-full">
    <!-- Left Side - Transactions Table -->
    <div class="flex h-full w-1/2 py-5 pr-2 pl-5">
      <TransactionsTable
        :campaign-id="String(route.params.campaignId)"
        :selected-id="selectedId"
        @select-entry="selectEntry"
      />
    </div>

    <!-- Right Side - Details Content -->
    <div class="flex w-1/2 flex-col py-5 pr-5 pl-2">
      <DetailsContent
        :selected-entry="selectedEntry || null"
        :edit-form-data="editFormData"
        :show-products-collapsed="showProductsCollapsed"
        :is-for-approval="true"
        @handle-decision="handleDecision"
        @clear-selection="clearSelection"
        @update:show-products-collapsed="showProductsCollapsed = $event"
        @update:edit-form-data="
          (data) => {
            // Deep clone to prevent reactivity mutations
            const clonedData = JSON.parse(JSON.stringify(data));
            updateEditFormData(clonedData);
          }
        "
      />
    </div>
  </div>

  <!-- Confirmation Dialog -->
  <ConfirmationDialog
    :open="showConfirmationDialog"
    :pending-decision="pendingDecision"
    :reset-patch-transaction="resetPatchTransaction"
    :is-patch-pending="isPatchPending"
    :is-patch-error="isPatchError"
    :patch-errors="patchErrors"
    @update:open="handleDialogClose"
    @confirm="confirmDecision"
    @cancel="cancelDecision"
  />
</template>

<style scoped>
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 1s infinite;
}
</style>
