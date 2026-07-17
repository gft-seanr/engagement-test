export const useCampaignTemplates = () => {
  const files = import.meta.glob('~/components/global/templates/*/*.vue', {
    eager: false,
  });

  const grouped: Record<string, string[]> = {};

  Object.keys(files).forEach((path) => {
    const parts = path.split('/');
    const fileName = parts.pop()?.replace('.vue', '') || '';
    const folderName = parts.pop() || '';

    if (!grouped[folderName]) {
      grouped[folderName] = [];
    }

    grouped[folderName].push(fileName);
  });

  const templates = Object.entries(grouped).map(([type, names]) => ({
    type: type,
    templates: names.map((name) => ({
      name,
      image: resolveTemplateImage(type, name),
    })),
  }));

  return templates;
};
