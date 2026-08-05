import InternalPreview from '~/admin/components/builder/preview/InternalPreview.vue';

export const category = 'navigation';

export const properties = {
  label: {
    default: 'Internal Link',
    editor: {
      type: 'text',
      label: 'Label',
    },
  },

  destination: {
    default: 'https://www.giftaway.ph',
    editor: {
      type: 'text',
      label: 'Destination URL',
    },
  },
};

export const thumbnail = InternalPreview;
