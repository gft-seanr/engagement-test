<script setup lang="ts">
import { User, Phone, Mail, UserX } from 'lucide-vue-next';
import { Button } from '@/components/shadcn-ui/button';
import type { SpamEntry } from '~/admin/types/receipt-dashboard';

interface Props {
  userId: string;
  selectedEntry?: SpamEntry | null;
}

defineProps<Props>();

// Mock user data - in real app this would come from an API
const userStats = {
  totalSubmissions: 15,
  approvedSubmissions: 8,
  rejectedSubmissions: 4,
  pendingSubmissions: 3,
};
</script>

<template>
  <div class="rounded-md border bg-white p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <User :size="24" class="text-blue-600" />
        <div class="ml-3">
          <h2 class="font-display text-lg font-bold">User Information</h2>
          <p class="text-xs text-gray-500">ID: {{ userId }}</p>
        </div>
      </div>

      <Button variant="destructive" size="sm" class="cursor-pointer">
        <UserX :size="16" class="mr-2" />
        SUSPEND
      </Button>
    </div>

    <!-- User Details -->
    <div v-if="selectedEntry" class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="flex items-center space-x-3">
        <User :size="16" class="text-gray-400" />
        <div>
          <label class="text-xs font-medium text-gray-700">Name</label>
          <p class="text-sm text-gray-900">{{ selectedEntry.name }}</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <Phone :size="16" class="text-gray-400" />
        <div>
          <label class="text-xs font-medium text-gray-700">Contact Number</label>
          <p class="text-sm text-gray-900">{{ selectedEntry.contactNumber }}</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <Mail :size="16" class="text-gray-400" />
        <div>
          <label class="text-xs font-medium text-gray-700">Email</label>
          <p class="text-sm text-gray-900">
            {{ selectedEntry.name.toLowerCase().replace(' ', '.') }}@email.com
          </p>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div class="rounded-lg bg-blue-50 p-2 text-center">
        <div class="text-xl font-bold text-blue-600">{{ userStats.totalSubmissions }}</div>
        <div class="text-xs text-blue-800">Total</div>
      </div>

      <div class="rounded-lg bg-green-50 p-2 text-center">
        <div class="text-xl font-bold text-green-600">{{ userStats.approvedSubmissions }}</div>
        <div class="text-xs text-green-800">Approved</div>
      </div>

      <div class="rounded-lg bg-red-50 p-2 text-center">
        <div class="text-xl font-bold text-red-600">{{ userStats.rejectedSubmissions }}</div>
        <div class="text-xs text-red-800">Rejected</div>
      </div>

      <div class="rounded-lg bg-yellow-50 p-2 text-center">
        <div class="text-xl font-bold text-yellow-600">{{ userStats.pendingSubmissions }}</div>
        <div class="text-xs text-yellow-800">Pending</div>
      </div>
    </div>
  </div>
</template>
