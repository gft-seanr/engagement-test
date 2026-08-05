import ExternalPreview from '~/admin/components/builder/preview/ExternalPreview.vue';

export const category = 'navigation';

export const properties = {
  label: {
    default: 'External Link',
    editor: {
      type: 'text',
      label: 'Label',
    },
  },
  destination: {
    default: 'https://www.example.com',
    editor: {
      type: 'text',
      label: 'Destination URL',
    },
  },
  prefixIcon: {
    default: 'lucide:link',
    editor: {
      group: 'Icon',
      label: 'Prefix Icon',
      type: 'icon-picker',
    },
  },
  suffixIcon: {
    default: '',
    editor: {
      group: 'Icon',
      label: 'Suffix Icon',
      type: 'icon-picker',
    },
  },
};

export const thumbnail = ExternalPreview;
