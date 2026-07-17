export const useAuthStore = defineStore('auth', () => {
  // Use useCookie for both client and server-side persistence
  const loginData = useCookie<Nullable<LoginData>>('loginData', {
    default: () => null,
    httpOnly: false, // Allow client-side access
    secure: true, // Use HTTPS in production
    sameSite: 'strict', // CSRF protection
    maxAge: 60 * 60 * 24, // 1 day
  });

  const loginOTPData = useCookie<Nullable<LoginOtpData>>('loginOTPData', {
    default: () => null,
    httpOnly: false, // Allow client-side access
    secure: true, // Use HTTPS in production
    sameSite: 'strict', // CSRF protection
    maxAge: 60 * 60 * 24, // 1 day
  });

  // Destructured computed properties for easy access
  const accessToken = computed(() => loginData.value?.accessToken || null); // access token directly from login if otp not required
  const otpAccessToken = computed(() => loginOTPData.value?.accessToken || null); // from otp

  const email = computed(() => loginData.value?.email || null);
  const referenceno = computed(() => loginData.value?.referenceno || null);
  const verificationToken = computed(() => loginData.value?.verificationToken || null);

  const clearLoginData = () => {
    loginData.value = null;
    loginOTPData.value = null;
  };

  const setLoginData = (data: LoginData) => {
    loginData.value = data;
  };

  const setLoginOTPData = (data: LoginOtpData) => {
    loginOTPData.value = data;
  };

  return {
    // Original loginData for backward compatibility
    loginData,

    // Destructured properties for easy access
    accessToken,
    otpAccessToken,
    email,
    referenceno,
    verificationToken,

    // Actions
    clearLoginData,
    setLoginData,
    setLoginOTPData,
  };
});
