import { usePreferredColorScheme } from '@vueuse/core';

export function useColorSchemeToggle() {
  const preferredColor = usePreferredColorScheme();

  const toggleColorScheme = (preferredColor: string) => {
    if (preferredColor === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  watch(
    () => preferredColor.value,
    (newValue) => {
      toggleColorScheme(newValue);
    },
    { immediate: true }
  );

  return {
    preferredColor,
    toggleColorScheme,
  };
}
