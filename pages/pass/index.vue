<script setup lang="ts">
// Extend the Window interface to include nsWebViewBridge
declare global {
  interface Window {
    nsWebViewBridge?: any;
  }
}
const passData = ref({});
const isLoggingIn = ref(false);

onMounted(() => {
  if (typeof window !== 'undefined' && window.nsWebViewBridge) {
    window.nsWebViewBridge.on('loginPass', (data: any) => {
      if (isLoggingIn.value) return;

      login({
        id: data.campaignId,
        token: data.engagementAccessToken,
      });
    });
  }
});

async function login(data: any) {
  isLoggingIn.value = true;
  await $fetch('/api/login/pass', {
    method: 'POST',
    body: data,
  });

  passData.value = data;

  await navigateTo(`/campaign/${data.id}/`, { replace: true, external: true });
}
</script>
<template>
  <div class="flex min-h-40 w-full flex-col items-center justify-center text-white">
    <Icon name="lucide:loader-circle" class="animate-spin text-2xl text-red-500" />
  </div>
</template>
