import { useBuilderStore } from '~admin/stores/builder';
import { createPageStructure } from '~/admin/utils/builder/page-factory';

export const usePageFactory = () => {
  const builderStore = useBuilderStore();

  const addPage = (type: string, template: string) => {
    if (builderStore.campaignConfig.pages[type]) {
      window.alert('Page type already exists!');
      return;
    }

    builderStore.campaignConfig.pages[type] = createPageStructure(type, template);
    builderStore.setActivePage(type);
  };

  const deletePage = (pageId: string) => {
    if (builderStore.activePageId === pageId) {
      builderStore.setActivePage('');
    }
    delete builderStore.campaignConfig.pages[pageId];
  };

  return { addPage, deletePage };
};
