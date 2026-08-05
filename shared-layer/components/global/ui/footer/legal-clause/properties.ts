import FooterPreview from '~/admin/components/builder/preview/FooterPreview.vue';

export const category = 'layout';

export const properties = {
  affiliate: {
    default: 'Giftaway',
    editor: {
      label: 'Affiliate',
      type: 'text',
    },
  },
  content: {
    editor: {
      label: 'Content',
      type: 'textarea',
    },
  },
};

export const thumbnail = FooterPreview;
