export function useFormProviders() {
  const sharedLoginData = ref<Record<string, any> | null>(null);
  const sharedLoginModel = ref<Record<string, any> | null>(null);

  function handleLoginSuccess(data: any) {
    console.log('Login success', data);
  }

  function handleRegisterSuccess(data: any) {
    console.log('Register success', data);
  }

  function handleRedeem(data: any) {
    console.log('Redeem', data);
  }

  function handleLoginOtpSuccess(data: any) {
    console.log('OTP success', data);
  }

  function handleSubmitSuccess(data: any) {
    console.log('Submit success', data);
  }

  provide('login', { handleLoginSuccess });
  provide('register', { handleRegisterSuccess });
  provide('redeem', { handleRedeem });
  provide('otp', {
    sharedLoginData,
    sharedLoginModel,
    handleLoginOtpSuccess,
  });
  provide('submit', { handleSubmitSuccess });

  return {
    sharedLoginData,
    sharedLoginModel,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleRedeem,
    handleLoginOtpSuccess,
  };
}
