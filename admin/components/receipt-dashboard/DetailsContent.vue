<script setup lang="ts">
import { ReceiptText, X } from 'lucide-vue-next';
import { useTransactionsExtendMutation } from '~/admin/composables/mutations/useTransactionsExtendMutation';
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';
import { getStoreIdByName } from '~/admin/utils/helpers';
import ImageDetailsDialog from '~/admin/components/receipt-dashboard/ImageDetailsDialog.vue';
import SubmissionDetailsSection from '~/admin/components/receipt-dashboard/details/SubmissionDetailsSection.vue';
import AuthResponseSection from '~/admin/components/receipt-dashboard/details/AuthResponseSection.vue';
import SpamFinderResponseSection from '~/admin/components/receipt-dashboard/details/SpamFinderResponseSection.vue';
import ManualReviewSection from '~/admin/components/receipt-dashboard/details/ManualReviewSection.vue';

interface Props {
  selectedEntry: ReceiptFileItem | null;
  editFormData: ReceiptFileItem | null;
  showProductsCollapsed: boolean;
  isForApproval?: boolean;
}

interface Emits {
  (event: 'handle-decision', statusId: number): void;
  (event: 'clear-selection'): void;
  (event: 'update:show-products-collapsed', value: boolean): void;
  (event: 'update:edit-form-data', data: ReceiptFileItem): void;
}

const route = useRoute();
const props = withDefaults(defineProps<Props>(), {
  isForApproval: true,
});
const emit = defineEmits<Emits>();

const { mutateExtendTransactions, isPending, receiptSignedURLsResponse, errors, isError } =
  useTransactionsExtendMutation();

// Current image index for navigation
const currentImageIndex = ref(0);
const isImageDialogOpen = ref(false);

// Watch for selectedEntry changes and fetch signed URLs
watch(
  () => props.selectedEntry,
  (newEntry, oldEntry) => {
    if (newEntry && newEntry.id !== oldEntry?.id) {
      mutateExtendTransactions({
        id: route.params.campaignId as string,
        hash: newEntry.id,
      });
    }
  },
  { immediate: false }
);

// Extract signed URLs from response
const signedURLs = computed(() => {
  return receiptSignedURLsResponse.value?.data?.signedUrls || [];
});

// Image dialog handlers
const openImageDialog = (index: number) => {
  currentImageIndex.value = index;
  isImageDialogOpen.value = true;
};

const navigateToNextImage = () => {
  if (signedURLs.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % signedURLs.value.length;
  }
};

const navigateToPreviousImage = () => {
  if (signedURLs.value.length > 0) {
    currentImageIndex.value =
      currentImageIndex.value === 0 ? signedURLs.value.length - 1 : currentImageIndex.value - 1;
  }
};

// Keyboard event handler
const handleKeydown = (event: KeyboardEvent) => {
  if (!isImageDialogOpen.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      navigateToPreviousImage();
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigateToNextImage();
      break;
    case 'Escape':
      event.preventDefault();
      isImageDialogOpen.value = false;
      break;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

// Update handlers
const updateFeedback = (feedback: string) => {
  if (!props.editFormData) return;
  const updatedData = { ...props.editFormData, feedback };
  emit('update:edit-form-data', updatedData);
};

const updateInvoiceNumber = (invoiceNumber: string) => {
  if (!props.editFormData) return;
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      invoiceNumber,
      products: props.editFormData.spamFinderResponse.products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
      })),
    },
  };
  emit('update:edit-form-data', updatedData);
};

const handleStoreSelection = (storeName: string) => {
  if (!props.editFormData) return;
  const storeId = getStoreIdByName(storeName);
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      storeName: storeName,
      storeId: storeId,
    },
  };
  emit('update:edit-form-data', updatedData);
};

const updateReceiptDateTime = (receiptDateTime: string) => {
  if (!props.editFormData) return;
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      receiptDateTime,
    },
  };
  emit('update:edit-form-data', updatedData);
};

const updateProductName = (index: number, newName: string) => {
  if (!props.editFormData) return;
  const updatedProducts = props.editFormData.spamFinderResponse.products.map((p, i) =>
    i === index ? { ...p, name: newName } : p
  );
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      products: updatedProducts,
    },
  };
  emit('update:edit-form-data', updatedData);
};

const updateProductQuantity = (index: number, newQuantity: string) => {
  if (!props.editFormData) return;
  const updatedProducts = props.editFormData.spamFinderResponse.products.map((p, i) =>
    i === index ? { ...p, quantity: Number(newQuantity) } : p
  );
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      products: updatedProducts,
    },
  };
  emit('update:edit-form-data', updatedData);
};

const addProduct = () => {
  if (!props.editFormData) return;
  const newProducts = [
    ...props.editFormData.spamFinderResponse.products,
    { name: 'SPAM LUNCHEON MEAT', quantity: 1 },
  ];
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      products: newProducts,
    },
  };
  emit('update:edit-form-data', updatedData);
};

const removeProduct = (index: number) => {
  if (!props.editFormData) return;
  const newProducts = props.editFormData.spamFinderResponse.products.filter((_, i) => i !== index);
  const updatedData = {
    ...props.editFormData,
    spamFinderResponse: {
      ...props.editFormData.spamFinderResponse,
      products: newProducts,
    },
  };
  emit('update:edit-form-data', updatedData);
};
</script>

<template>
  <div v-if="!selectedEntry" class="flex h-full items-center justify-center text-gray-500">
    <div class="text-center">
      <Icon
        name="lucide:mouse-pointer-click"
        :size="48"
        class="animate-bounce-slow mx-auto mb-4 text-gray-400"
      />
      <p class="text-lg font-medium">Click on a row in the table</p>
      <p class="text-sm">to view detailed information</p>
    </div>
  </div>

  <div v-else class="flex h-full flex-col rounded-md border border-gray-200 bg-white">
    <!-- Details Header -->
    <div class="grid grid-cols-2 gap-4 border-b border-gray-200 px-6 pt-6 pb-4">
      <div class="flex min-w-0">
        <ReceiptText :size="32" class="flex-shrink-0" />
        <div class="ml-4 flex min-w-0 flex-col justify-center">
          <h2 class="font-display text-lg font-bold">Receipt Details</h2>
          <p class="text-sm break-words text-gray-500">
            Details for Submission ID:
            <span class="font-bold break-all">{{ selectedEntry.id }}</span>
          </p>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          @click="$emit('clear-selection')"
          class="cursor-pointer dark:border-gray-300 dark:bg-white dark:text-gray-900"
        >
          <X :size="16" />
        </Button>
      </div>
    </div>

    <!-- Details Content -->
    <div class="flex-1 space-y-8 overflow-auto p-6">
      <!-- Submission Details Section -->
      <SubmissionDetailsSection
        v-if="selectedEntry"
        :selected-entry="selectedEntry"
        :signed-u-r-ls="signedURLs"
        :is-pending="isPending"
        :is-error="isError"
        :errors="errors"
        @open-image="openImageDialog"
      />

      <!-- Image Navigation Dialog -->
      <ImageDetailsDialog
        :open="isImageDialogOpen"
        :images="signedURLs"
        :current-image-index="currentImageIndex"
        :selected-entry="selectedEntry"
        :edit-form-data="editFormData"
        @update:open="isImageDialogOpen = $event"
        @update:current-image-index="currentImageIndex = $event"
        @navigate-previous="navigateToPreviousImage"
        @navigate-next="navigateToNextImage"
      />

      <!-- Auth Response Section -->
      <AuthResponseSection v-if="editFormData && selectedEntry" :selected-entry="selectedEntry" />

      <!-- Spam Finder Response Section -->
      <SpamFinderResponseSection
        v-if="editFormData"
        :edit-form-data="editFormData"
        :show-products-collapsed="showProductsCollapsed"
        :is-for-approval="isForApproval"
        @update:show-products-collapsed="$emit('update:show-products-collapsed', $event)"
        @update-invoice-number="updateInvoiceNumber"
        @update-store-selection="handleStoreSelection"
        @update-receipt-date-time="updateReceiptDateTime"
        @update-product-name="updateProductName"
        @update-product-quantity="updateProductQuantity"
        @add-product="addProduct"
        @remove-product="removeProduct"
      />

      <!-- Manual Review Decision Section -->
      <ManualReviewSection
        v-if="editFormData && isForApproval"
        :edit-form-data="editFormData"
        @update-feedback="updateFeedback"
        @handle-decision="$emit('handle-decision', $event)"
      />
    </div>
  </div>
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
