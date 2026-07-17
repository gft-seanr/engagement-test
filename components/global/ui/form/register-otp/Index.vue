<script lang="ts" setup>
import type { FormKitSchemaDefinition } from '@formkit/core';

const { schema, alert } = defineProps<{
  alert?: {
    component: string;
    map: AlertMap<RegisterOtpErrorCode>;
    props?: Record<string, any>;
  };
  schema: FormKitSchemaDefinition;
}>();

const { sharedRegisterData, sharedRegisterModel, handleRegisterOtpSuccess } = inject<{
  sharedRegisterData: Ref<RegisterData>;
  sharedRegisterModel: Ref<RegisterParams>;
  handleRegisterOtpSuccess: (data: RegisterOtpData | null) => void;
}>('otp')!;

const {
  registerOtpModel,
  isPending,
  isError: isRegisterOtpError,
  errors,
  alerts: registerOtpAlerts,
  reset: resetRegisterOtp,
  handleRegisterOtp,
} = useRegisterOtpMutation(handleRegisterOtpSuccess, alert?.map);

function handleSubmit() {
  handleRegisterOtp(
    resendVerificationToken.value || sharedRegisterData.value.verificationToken || '',
    sharedRegisterModel.value.mobileno || ''
  );

  resetResendOtp();
}

const {
  registerModel: resendOtpData,
  isPending: isResending,
  handleRegister: handleResendOtp,
  reset: resetResendOtp,
  alerts: resendOtpAlerts,
  registerResponse: resendOtpResponse,
  isError: isResendOtpError,
} = useRegisterMutation(handleResendSuccess, DEFAULT_REGISTER_RESEND_ALERT);

const resendVerificationToken = ref('');

function handleResendCode() {
  resendOtpData.value = {
    ...sharedRegisterModel.value,
  };

  resetRegisterOtp();
  handleResendOtp();
}

function handleResendSuccess(data: RegisterData | null) {
  resendVerificationToken.value = data?.verificationToken || '';
}

const activeAlerts = computed(() => {
  if (isRegisterOtpError.value) {
    return registerOtpAlerts.value;
  }

  if (resendOtpResponse.value?.isSuccessful || isResendOtpError.value) {
    return resendOtpAlerts.value;
  }

  return [];
});

const isShowAlerts = computed(() => {
  return (
    isRegisterOtpError.value || resendOtpResponse.value?.isSuccessful || isResendOtpError.value
  );
});
</script>
<template>
  <div class="[&_*:last-child]:mb-0">
    <FormKit
      type="form"
      id="registerOtpForm"
      name="registerOtpForm"
      v-model="registerOtpModel"
      :incomplete-message="false"
      :actions="false"
      :disabled="isPending"
      #default="{ disabled, state }"
      @submit="handleSubmit"
    >
      <component
        v-if="isShowAlerts"
        :is="alert?.component || 'alert-card'"
        :alerts="activeAlerts"
        v-bind.props="{ ...alert?.props }"
        class="mb-4"
      >
      </component>

      <FormKitSchema
        v-if="schema"
        :schema="schema"
        :data="{
          disabled: disabled || isResending,
          ...sharedRegisterModel,
          state,
          isPending,
          formkitSlice,
        }"
      />
    </FormKit>

    <p class="mt-4 text-center text-sm" v-if="errors && errors[0]?.code === 'InvalidToken'">
      <button
        @click="handleResendCode"
        type="button"
        :disabeld="isResending"
        :class="{
          'cursor-not-allowed opacity-50': isResending,
        }"
        class="text-primary underline underline-offset-2 hover:cursor-pointer hover:text-primary dark:text-primary-soft"
      >
        Request a new verification code
      </button>
    </p>

    <p class="mt-4 text-center text-sm" v-else>
      Did not receive code?
      <button
        @click="handleResendCode"
        :disabeld="isResending"
        type="button"
        class="cursor-pointer text-primary underline underline-offset-2 hover:text-primary dark:text-primary-soft"
        :class="{
          'cursor-not-allowed opacity-50': isResending,
        }"
      >
        Resend
      </button>
    </p>
  </div>
</template>
