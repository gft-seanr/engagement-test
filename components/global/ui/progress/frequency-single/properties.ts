import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const category = 'widgets';

export const properties = {
  target: {
    default: 10,
    editor: {
      type: 'number',
      label: 'Target',
      unit: 'number',
    },
  },
  current: {
    default: 1,
    editor: {
      type: 'number',
      label: 'Current',
      unit: 'number',
    },
  },
};

export const thumbnail = CardPreview;
