import ButtonPreview from '~/admin/components/builder/preview/ButtonPreview.vue';
import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const category = 'navigation';

export const properties = {
  label: {
    default: 'Logout',
    editor: {
      label: 'Title',
      type: 'text',
    },
  },
  prefixIcon: {
    default: 'lucide:log-out',
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

export const thumbnail = ButtonPreview;

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
