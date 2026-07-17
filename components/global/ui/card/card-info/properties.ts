import InfoCardPreview from '~/admin/components/builder/preview/InfoCardPreview.vue';

export const category = 'widgets';

export const properties = {
  title: {
    default: 'Sample Heading',
    editor: {
      label: 'Title',
      type: 'text',
    },
  },
  iconUrl: {
    default: 'https://placehold.co/64x64',
    editor: {
      label: 'Icon Image URL',
      type: 'image-uploader',
    },
  },
  iconSize: {
    default: 64,
    editor: {
      group: 'Icon',
      label: 'Icon Size (px)',
      type: 'number',
      min: 16,
      max: 128,
    },
  },

  description: {
    default: 'Lorem ipsum dolor sit amet, description text.',
    editor: {
      label: 'Description',
      type: 'textarea',
    },
  },
};

export const thumbnail = InfoCardPreview;

export const padding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
