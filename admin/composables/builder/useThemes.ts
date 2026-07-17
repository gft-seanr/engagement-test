export const useThemes = () => {
  const themeFiles = import.meta.glob('~/assets/formkit-themes/formkit-theme-*.ts', {
    eager: false,
  });

  const themes = Object.keys(themeFiles).map((path) => {
    const filename = path.split('/').pop() || '';

    const match = filename.match(/formkit-(.+)\.ts$/);

    return match ? match[1] : null;
  });

  function generateThemeTitle(theme: string) {
    return theme
      .split('-')
      .map((word, index) =>
        index === 1
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }

  return themes
    .map((theme) => {
      if (theme) {
        return {
          id: theme,
          name: generateThemeTitle(theme),
        };
      }
      return null;
    })
    .filter((t): t is { id: string; name: string } => t !== null);
};
