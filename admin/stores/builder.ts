import { skipHydrate, defineStore } from 'pinia';
import { ref, computed, triggerRef } from 'vue';

export const useBuilderStore = defineStore('builder', () => {
  // State
  const campaignConfig = ref<any>({ pages: {} });
  const originalConfigString = ref<string>('');
  const isInitialized = ref(false);

  const mode = ref<'build' | 'preview'>('build');
  const zoomLevel = ref(1);
  const isDragging = ref(false);
  const activeCanvasTool = ref<'pointer' | 'hand'>('pointer');

  // Selection State
  const activePageId = ref<string | null>(null);
  const selectedSectionId = ref<string | null>(null);
  const activeState = ref<string>('');
  const clipboard = ref<any>(null);

  // Getters
  const activePageConfig = computed(() => {
    if (activePageId.value && campaignConfig.value.pages) {
      return campaignConfig.value.pages[activePageId.value];
    }
    return null;
  });

  const selectedSection = computed(() => {
    if (!selectedSectionId.value || !activePageConfig.value) return null;
    return activePageConfig.value.sections.find((s: any) => s.id === selectedSectionId.value);
  });

  async function initializeBuilder(config: any) {
    try {
      isInitialized.value = false;

      const payload =
        config && Object.keys(config).length > 0
          ? config
          : { pageHead: { title: 'New Campaign' }, pages: {} };

      campaignConfig.value = JSON.parse(JSON.stringify(payload));
      originalConfigString.value = JSON.stringify(payload);

      await nextTick();
    } catch (e) {
      console.error('Failed to load campaign', e);
    } finally {
      isInitialized.value = true;
    }
  }

  const isDirty = computed(() => {
    if (!originalConfigString.value) return false;

    return JSON.stringify(campaignConfig.value) !== originalConfigString.value;
  });

  function markAsSaved() {
    originalConfigString.value = JSON.stringify(campaignConfig.value);
  }

  function clearBuilder() {
    campaignConfig.value = { pages: {} };
    originalConfigString.value = '';
  }

  // Setters
  function setConfig(data: any) {
    campaignConfig.value = data;
  }

  function setActivePage(id: string) {
    activePageId.value = id;
  }

  function setSelectedSectionId(id: string | null) {
    selectedSectionId.value = id;
  }

  function setActiveState(newState: string) {
    activeState.value = newState;
  }

  function updateSelectedSectionProps(key: string, value: any) {
    if (!selectedSectionId.value || !activePageId.value) return;

    const page = campaignConfig.value.pages?.[activePageId.value];
    if (!page) return;

    const sections: any[] = page.sections || [];
    const sectionIndex = sections.findIndex((s: any) => s.id === selectedSectionId.value);
    if (sectionIndex === -1) return;

    console.log('[builder] updateSelectedSectionProps', key, value);

    page.sections = sections.map((s: any, i: number) =>
      i === sectionIndex ? { ...s, props: { ...s.props, [key]: value } } : s
    );

    console.log('[builder] new sections[sectionIndex].props:', page.sections[sectionIndex].props);
    triggerRef(campaignConfig);
    console.log('[builder] triggerRef done');
  }

  return {
    // State
    campaignConfig: skipHydrate(campaignConfig),
    isInitialized,
    zoomLevel,
    mode,
    activeCanvasTool,
    activePageId,
    isDragging,
    selectedSectionId,
    activeState,
    clipboard,

    // Getters
    activePageConfig,
    selectedSection,

    // Actions
    initializeBuilder,
    setConfig,
    setActivePage,
    setSelectedSectionId,
    setActiveState,
    updateSelectedSectionProps,
    isDirty,
    markAsSaved,
    clearBuilder,
  };
});
