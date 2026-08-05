<script lang="ts" setup>
import type { FormKitSchemaDefinition } from '@formkit/core';

const { schema, alert } = defineProps<{
  alert?: {
    component: string;
    map: AlertMap<LoginOtpErrorCode>;
    props?: Record<string, any>;
  };
  schema: FormKitSchemaDefinition;
}>();

const { sharedLoginData, sharedLoginModel, handleLoginOtpSuccess } = inject<{
  sharedLoginData: Ref<LoginData>;
  sharedLoginModel: Ref<LoginParams>;
  handleLoginOtpSuccess: (data: LoginOtpData | null) => void;
}>('otp')!;

const {
  loginOtpModel,
  isPending,
  isError: isLoginOtpError,
  errors,
  alerts: loginOtpAlerts,
  reset: resetLoginOtp,
  handleLoginOtp,
} = useLoginOtpMutation(handleLoginOtpSuccess, alert?.map);

function handleSubmit() {
  handleLoginOtp(resendVerificationToken.value || sharedLoginData.value.verificationToken || '');

  resetResendOtp();
}

const {
  loginModel: resendOtpModel,
  isPending: isResending,
  handleLogin: handleResendOtp,
  reset: resetResendOtp,
  alerts: resendOtpAlerts,
  loginResponse: resendOtpResponse,
  isError: isResendOtpError,
} = useLoginMutation(handleResendSuccess);

const resendVerificationToken = ref('');

function handleResendCode() {
  resendOtpModel.value = {
    ...sharedLoginModel.value,
  };

  resetLoginOtp();
  handleResendOtp();
}

function handleResendSuccess(data: LoginData | null) {
  resendVerificationToken.value = data?.verificationToken || '';
}

const activeAlerts = computed(() => {
  if (isLoginOtpError.value) {
    return loginOtpAlerts.value;
  }

  if (resendOtpResponse.value?.isSuccessful || isResendOtpError.value) {
    return resendOtpAlerts.value;
  }

  return [];
});

const isShowAlerts = computed(() => {
  return isLoginOtpError.value || resendOtpResponse.value?.isSuccessful || isResendOtpError.value;
});
</script>
<template>
  <div class="[&_*:last-child]:mb-0">
    <FormKit
      type="form"
      id="loginOtpForm"
      name="loginOtpForm"
      v-model="loginOtpModel"
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
          ...sharedLoginModel,
          ...sharedLoginData,
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
