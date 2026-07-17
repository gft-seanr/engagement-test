<script setup lang="ts">
import { ChevronLeft, Pin } from 'lucide-vue-next';
import { useMutation } from '@tanstack/vue-query';

import PageTitle from '~/admin/components/shared/PageTitle.vue';
import { PinInput, PinInputGroup, PinInputSlot } from '~/admin/components/admin-ui/pin-input';
import Label from '~/admin/components/shared/Label.vue';

definePageMeta({
  layout: 'auth',
  middleware: ['verify', 'admin'],
});

const route = useRoute();
const { setLoginOTPData, verificationToken } = useAuthStore();

const appConfig = useAppConfig();

const {
  verificationMutation: { isPending: isVerifyPending, isError: isVerifyError, error: verifyError },
  otpRequest,
  handleVerify,
} = useVerificationMutation();

const { verificationCode, verificationCodeError, validateCode } = useVerificationCode();

const alertState = ref<{
  type: 'resend-success' | 'resend-error' | 'verify-error' | null;
  message: string;
}>({
  type: null,
  message: '',
});

function useVerificationMutation() {
  const verificationMutation = useMutation({
    mutationFn: (request: LoginOtpParams) => loginOtp(request),
    onSuccess: (data) => {
      if (!data.data?.accessToken) return;
      setLoginOTPData(data.data);

      const campaignId = route.params.campaignId as string;

      const campaigns = appConfig.engagementAdmin?.campaigns || [];
      const matchedCampaign = campaigns.find((c: any) => c.id === campaignId);

      if (matchedCampaign && matchedCampaign.to) {
        const targetRoute = matchedCampaign.to.replace('{{id}}', campaignId);
        navigateTo(targetRoute);
      } else {
        console.warn(`No landing page mapped for campaign ID: ${campaignId}`);
        navigateTo(`/admin/${campaignId}/login`);
      }
    },
  });

  const otpRequest = ref<LoginOtpParams>({
    token: verificationToken || '',
    id: route.params.campaignId as string,
    code: '',
  });

  const handleVerify = () => {
    if (validateCode()) {
      alertState.value = { type: null, message: '' };
      verificationMutation.mutate(otpRequest.value);
    }
  };

  return {
    otpRequest,
    verificationMutation,
    handleVerify,
  };
}

function useVerificationCode() {
  const verificationCode = ref<string[]>([]);
  const verificationCodeError = ref('');

  const validateCode = () => {
    const code = verificationCode.value.join('').trim();
    if (!code) {
      verificationCodeError.value = 'Verification code is required.';
      return false;
    }

    if (code.length < 6) {
      verificationCodeError.value = 'Enter all 6 digits to continue.';
      return false;
    }

    otpRequest.value.code = code;
    verificationCodeError.value = '';
    return true;
  };

  return {
    verificationCode,
    verificationCodeError,
    validateCode,
  };
}

const verifyButtonRef = ref<HTMLElement>();

watch(
  verificationCode,
  (newCode) => {
    const filledDigits = newCode.filter((digit) => digit && digit.trim() !== '');

    if (filledDigits.length === 6) {
      nextTick(() => {
        const buttonElement = verifyButtonRef.value;
        if (buttonElement) {
          if (buttonElement.focus) {
            buttonElement.focus();
          } else if ((buttonElement as any).$el && (buttonElement as any).$el.focus) {
            (buttonElement as any).$el.focus();
          } else {
            const actualButton = buttonElement.querySelector('button');
            if (actualButton) {
              actualButton.focus();
            }
          }
        }
      });
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="mx-auto w-full max-w-sm px-4 sm:px-6 md:max-w-md lg:max-w-lg">
    <NuxtLink
      :to="`/admin/${$route.params.campaignId}/login`"
      class="body-3 mb-10 flex w-auto max-w-fit items-center font-normal text-neutral-600 hover:underline"
    >
      <ChevronLeft :size="18" class="mr-2" /> Back
    </NuxtLink>

    <PageTitle
      title="Verification"
      description="A verification has been sent to your email. Please enter it below."
      class="mb-7"
    />

    <div class="mb-6 w-full">
      <Alert
        v-if="alertState.type"
        :variant="alertState.type === 'resend-success' ? 'default' : 'destructive'"
      >
        {{ alertState.message }}
      </Alert>
    </div>

    <div>
      <Label>Verification Code</Label>
      <PinInput v-model="verificationCode">
        <PinInputGroup>
          <PinInputSlot
            v-for="i in 6"
            :key="i"
            :index="i - 1"
            class="uppercase"
            :class="{
              'border-red-500': !!verificationCodeError,
            }"
          />
        </PinInputGroup>
      </PinInput>
      <!-- <HelperMessage v-if="verificationCodeError" variant="error" class="mt-2">{{
        verificationCodeError
      }}</HelperMessage> -->
    </div>

    <Button
      ref="verifyButtonRef"
      @click="handleVerify"
      :is-loading="isVerifyPending"
      class="!body-2 mt-5 w-full justify-center bg-purple-500 font-bold text-white hover:bg-purple-600"
      tabindex="0"
    >
      {{ isVerifyPending ? 'Verifying...' : 'Verify' }}
    </Button>
  </div>
</template>
