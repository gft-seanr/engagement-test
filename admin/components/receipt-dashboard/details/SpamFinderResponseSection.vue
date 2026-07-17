<script setup lang="ts">
import { ChevronDownIcon, Plus, X } from 'lucide-vue-next';
import type { ReceiptFileItem } from '~/admin/types/receipt-dashboard';
import { getStoreIdByName, getStoreOptions, getSpamProductOptions } from '~/admin/utils/helpers';

interface Props {
  editFormData: ReceiptFileItem;
  showProductsCollapsed: boolean;
  isForApproval: boolean;
}

interface Emits {
  (event: 'update:show-products-collapsed', value: boolean): void;
  (event: 'update-invoice-number', value: string): void;
  (event: 'update-store-selection', storeName: string): void;
  (event: 'update-receipt-date-time', value: string): void;
  (event: 'update-product-name', index: number, name: string): void;
  (event: 'update-product-quantity', index: number, quantity: string): void;
  (event: 'add-product'): void;
  (event: 'remove-product', index: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const storeOptions = getStoreOptions();
const spamProductOptions = getSpamProductOptions();

const totalQuantity = computed(() => {
  if (!props.editFormData?.spamFinderResponse?.products) return 0;
  return props.editFormData.spamFinderResponse.products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
});
</script>

<template>
  <div class="space-y-4">
    <h3 class="border-b border-gray-200 pb-2 text-lg font-semibold">Spam Finder Response</h3>

    <FormKit type="form" :form-class="'space-y-4'" :actions="false" :disabled="!isForApproval">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormKit
          type="text"
          name="invoiceNumber"
          label="Invoice Number"
          :label-class="'$reset font-bold text-sm'"
          :model-value="editFormData.spamFinderResponse.invoiceNumber || ''"
          @input="emit('update-invoice-number', $event as string)"
          :disabled="!isForApproval"
          input-class="dark:!text-black font-normal text-sm"
        />

        <FormKit
          type="select"
          name="storeName"
          label="Store Name"
          :label-class="'$reset font-bold text-sm'"
          :options="[{ label: 'Select a store...', value: '' }, ...storeOptions]"
          :model-value="editFormData.spamFinderResponse.storeName || ''"
          @input="emit('update-store-selection', $event as string)"
          :disabled="!isForApproval"
          input-class="dark:!text-black font-normal text-sm"
        />

        <div>
          <label class="text-sm font-bold">Store ID</label>
          <p class="mt-1 rounded-md bg-gray-50 p-3 text-sm text-gray-900">
            {{ editFormData.spamFinderResponse.storeId }}
          </p>
        </div>

        <FormKit
          type="datetime-local"
          name="receiptDateTime"
          label="Receipt Date & Time"
          :label-class="'$reset font-bold text-sm'"
          :model-value="editFormData.spamFinderResponse.receiptDateTime || ''"
          @input="emit('update-receipt-date-time', $event as string)"
          :disabled="!isForApproval"
          input-class="dark:!text-black font-normal text-sm"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-1">
        <div>
          <label class="text-sm font-bold">Total SPAM Cans</label>
          <p class="mt-1 rounded-md bg-gray-50 p-3 text-sm">
            {{ totalQuantity }}
          </p>
        </div>
      </div>

      <!-- Collapsible Products Found -->
      <div class="rounded-md border border-gray-200">
        <button
          type="button"
          @click="emit('update:show-products-collapsed', !showProductsCollapsed)"
          class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
        >
          <span class="text-sm font-medium text-gray-700">
            Products Found ({{ editFormData.spamFinderResponse.products.length }})
          </span>
          <div class="flex items-center gap-2">
            <Button
              v-if="isForApproval && !showProductsCollapsed"
              type="button"
              @click.stop="emit('add-product')"
              variant="outline"
              size="sm"
              class="h-6 w-6 p-0 dark:border-gray-300 dark:bg-white dark:text-gray-900"
            >
              <Plus :size="12" />
            </Button>
            <ChevronDownIcon
              :class="['transition-transform', showProductsCollapsed ? 'rotate-180' : '']"
              :size="16"
            />
          </div>
        </button>

        <div v-show="!showProductsCollapsed" class="space-y-3 border-t border-gray-200 p-4">
          <div
            v-for="(product, index) in editFormData.spamFinderResponse.products"
            :key="`${editFormData.id}-${index}-${product.name}-${product.quantity}`"
            class="relative grid grid-cols-1 gap-3 rounded-md bg-gray-50 p-3 md:grid-cols-2 lg:grid-cols-3"
          >
            <FormKit
              type="select"
              :name="`products.${index}.name`"
              :key="`product-name-${editFormData.id}-${index}`"
              label="Product"
              :options="spamProductOptions"
              :model-value="product.name"
              @input="emit('update-product-name', index, $event as string)"
              input-class="font-normal text-sm !text-black"
              label-class="dark:!text-black"
            />
            <FormKit
              class="$reset"
              type="number"
              :name="`products.${index}.quantity`"
              :key="`product-quantity-${editFormData.id}-${index}`"
              label="Quantity"
              label-class="dark:!text-black"
              :input-class="'font-normal text-sm dark:!text-black'"
              :model-value="String(product.quantity)"
              min="1"
              step="1"
              @input="emit('update-product-quantity', index, $event as string)"
            />
            <button
              v-if="isForApproval && editFormData.spamFinderResponse.products.length > 1"
              type="button"
              @click="emit('remove-product', index)"
              class="absolute top-2 right-2 rounded-full p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <X :size="16" />
            </button>
          </div>
        </div>
      </div>
    </FormKit>
  </div>
</template>
