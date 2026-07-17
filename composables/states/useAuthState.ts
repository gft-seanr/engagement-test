export function useAuthState() {
  return useState('auth', () => ({
    isLoggedIn: false,
    isUnauthorized: false,
  }));
}
