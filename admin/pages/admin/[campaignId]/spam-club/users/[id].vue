<script setup lang="ts">
import type { SpamFinderResponse, AuthResponse, SpamEntry } from '~/admin/types/receipt-dashboard';
import TransactionsTable from '~/admin/components/receipt-dashboard/TransactionsTable.vue';
import DetailsContent from '~/admin/components/receipt-dashboard/DetailsContent.vue';
import UserInfo from '~/admin/components/receipt-dashboard/UserInfo.vue';
import { FileStackIcon } from 'lucide-vue-next';

// Generate more dummy data for pagination
const generateSpamEntries = (count: number): SpamEntry[] => {
  const entries: SpamEntry[] = [];
  const names = [
    'John Doe',
    'EFG Marquez',
    'Maria Santos',
    'John dela Cruz',
    'Josh de Guzman',
    'John Doe',
    'John dela Cruz',
    'John Smith',
    'Anne Marie',
    'Maria Jane',
  ];

  for (let i = 0; i < count; i++) {
    entries.push({
      id: `SP-${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length] + (i > 9 ? ` ${Math.floor(i / 10) + 1}` : ''),
      contactNumber: `099856${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      statusId: Math.floor(Math.random() * 3), // 0, 1, or 2
      reason:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      images: [
        // Original files: '/SM Supermarket p1.jpg', '/SM Supermarket pt2.jpg'
        `https://picsum.photos/400/300?random=${i + 1}`,
        `https://picsum.photos/400/300?random=${i + 100}`,
      ],
      spamFinderResponse: {
        invoiceNumber: `INV-${String(i + 1).padStart(6, '0')}`,
        storeName: 'SM Supermarket',
        storeId: 'SM001',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        quantity: Math.floor(Math.random() * 10) + 1,
        productsFound: [
          { product: 'SPAM BACON', quantity: 2 },
          { product: 'SPAM LITE', quantity: 1 },
          { product: 'SPAM REGULAR', quantity: 3 },
        ],
      },
      authResponse: {
        statusCode: Math.random() > 0.5 ? 200 : 400,
        title: Math.random() > 0.5 ? 'Valid Receipt' : 'Invalid Receipt',
        description:
          Math.random() > 0.5
            ? 'Receipt has been verified and authenticated successfully.'
            : 'Receipt failed verification due to suspicious patterns.',
      },
      submissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return entries;
};

// Generate 157 entries for pagination demo
const allSpamEntries: SpamEntry[] = generateSpamEntries(157);

const route = useRoute();
const router = useRouter();

// Pagination
const itemsPerPage = 25;
const currentPage = computed({
  get: () => parseInt(route.query.page as string) || 1,
  set: (page: number) => {
    router.push({
      path: route.path,
      query: { ...route.query, page: page.toString() },
    });
  },
});

// Paginated entries
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allSpamEntries.slice(start, end);
});

const selectedId = computed(() => route.query.id as string);
const selectedEntry = computed(() => allSpamEntries.find((entry) => entry.id === selectedId.value));

// Get the user ID from route parameter
const userId = computed(() => route.params.id as string);

// Dynamic breadcrumbs based on route parameter
const dynamicBreadcrumbs = computed(() => {
  const baseBreadcrumbs = [
    { label: 'Admin', to: '/admin' },
    { label: 'SPAM Club', to: '/admin/spam-club/dashboard' },
    { label: 'Users', to: '/admin/spam-club/dashboard' },
    { label: userId.value, to: `/admin/spam-club/users/${userId.value}` },
  ];

  return baseBreadcrumbs;
});

definePageMeta({
  name: 'spam-club-users-id',
  layout: 'dashboard',
  middleware: 'admin',
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

const selectEntry = (entry: SpamEntry) => {
  router.push({
    path: route.path,
    query: { ...route.query, id: entry.id },
  });
};

const clearSelection = () => {
  const { id, ...queryWithoutId } = route.query;
  router.push({
    path: route.path,
    query: queryWithoutId,
  });
};

// Form data for editing
const editFormData = ref<{ spamFinder: SpamFinderResponse; authResponse: AuthResponse } | null>(
  null
);
const showProductsCollapsed = ref(true);

// Initialize form data when entry is selected
watch(
  selectedEntry,
  (entry) => {
    if (entry) {
      editFormData.value = {
        spamFinder: { ...entry.spamFinderResponse },
        authResponse: { ...entry.authResponse },
      };
    } else {
      editFormData.value = null;
    }
  },
  { immediate: true }
);

const saveChanges = () => {
  if (!selectedEntry.value || !editFormData.value) return;

  // Update the local data (in a real app, this would come from the server response)
  selectedEntry.value.spamFinderResponse = { ...editFormData.value.spamFinder };
  selectedEntry.value.authResponse = { ...editFormData.value.authResponse };
};

const approveEntry = () => {
  if (!selectedEntry.value) return;

  // You could show a success message or redirect
  // For now, we'll just clear the selection
  clearSelection();
};

const rejectEntry = () => {
  if (!selectedEntry.value) return;

  // You could show a confirmation dialog or redirect
  // For now, we'll just clear the selection
  clearSelection();
};
</script>

<template>
  <div class="flex h-full w-full flex-col space-y-5 p-5">
    <!-- User Information Component -->
    <UserInfo :user-id="userId" :selected-entry="selectedEntry" />

    <!-- Tables Section -->
    <div class="flex w-full flex-1 space-x-5">
      <!-- Left Side - Transactions Table -->
      <div class="flex h-full w-1/2">
        <TransactionsTable
          :entries="paginatedEntries"
          :selected-id="selectedId"
          :current-page="currentPage"
          :total-items="allSpamEntries.length"
          :items-per-page="itemsPerPage"
          :header-icon="FileStackIcon"
          header-title="Submission History"
          :header-description="`List of ${selectedEntry?.personalInfo?.fullName || 'User'}'s SPAM Club submissions`"
          @select-entry="selectEntry"
          @update:current-page="currentPage = $event"
        />
      </div>

      <!-- Right Side - Details Content -->
      <div class="flex h-full w-1/2 flex-col">
        <DetailsContent
          :selected-entry="selectedEntry || null"
          :edit-form-data="editFormData"
          :show-products-collapsed="showProductsCollapsed"
          :is-for-approval="false"
          @approve-entry="approveEntry"
          @reject-entry="rejectEntry"
          @clear-selection="clearSelection"
          @save-changes="saveChanges"
          @update:show-products-collapsed="showProductsCollapsed = $event"
          @update:edit-form-data="editFormData = $event"
        />
      </div>
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
