export function useProgramColors(colors: ProgramColors) {
  const colorVariables = computed(() => ({
    '--primary': colors?.['--primary'],
    '--primary-soft': colors?.['--primary-soft'],
    '--primary-dark': colors?.['--primary-dark'],
    '--primary-dark-soft': colors?.['--primary-dark-soft'],
    '--secondary': colors?.['--secondary'],
    '--secondary-soft': colors?.['--secondary-soft'],
    '--secondary-dark': colors?.['--secondary-dark'],
    '--secondary-dark-soft': colors?.['--secondary-dark-soft'],
  }));

  return {
    colorVariables,
  };
}
