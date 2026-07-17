import DividerPreview from '~/admin/components/builder/preview/DividerPreview.vue';

export const category = 'layout';

export const properties = {
  label: {
    default: 'OR',
    editor: {
      type: 'text',
      label: 'Label',
    },
  },
};

export const thumbnail = DividerPreview;
