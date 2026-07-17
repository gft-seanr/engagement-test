import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';
import TokenCountPreview from '~/admin/components/builder/preview/TokenCountPreview.vue';

export const category = 'widgets';

export const properties = {
  title: {
    default: 'Token Count',
    editor: {
      type: 'text',
      label: 'Title',
    },
  },
  iconUrl: {
    default: 'lucide:credit-card',
    editor: {
      group: 'Icon',
      type: 'icon-picker',
      label: 'Icon',
    },
  },
  singularUnit: {
    default: 'Point',
    editor: {
      group: 'Unit',
      type: 'text',
      label: 'Singular Unit',
    },
  },
  pluralUnit: {
    default: 'Points',
    editor: {
      group: 'Unit',
      type: 'text',
      label: 'Plural Unit',
    },
  },
  footer: {
    default: 'Total Spend',
    editor: {
      type: 'textarea',
      label: 'Footer',
    },
  },
};

export const thumbnail = TokenCountPreview;

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
