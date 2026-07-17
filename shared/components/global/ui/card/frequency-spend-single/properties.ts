import FrequencySinglePreview from '~/admin/components/builder/preview/FrequencySinglePreview.vue';

export const category = 'widgets';

export const properties = {
  program: {
    default: {
      programId: 'DEFAULT-PROG-001',
      status: 'available',
      colors: {
        'accent-primary': '#8b5cf6',
        'accent-primary-light': '#ede9fe',
        'dark-accent-primary': '#7c3aed',
        'dark-accent-primary-light': '#2e1065',
        'secondary-primary': '#0ea5e9',
        'secondary-primary-light': '#e0f2fe',
        'dark-secondary-primary': '#0284c7',
        'dark-secondary-primary-light': '#082f49',
      },
      unit: {
        currency: { prefix: 'PHP ', suffix: '' },
        label: { current: 'Spent', remaining: 'to go', target: 'Goal' },
      },
    },
    editor: {
      group: 'Program',
      label: 'Program Configuration',
      type: 'object',
      children: {
        programId: { label: 'Program ID', type: 'text', default: '' },
        colors: {
          label: 'Brand Colors',
          type: 'object',
          children: {
            'accent-primary': { label: 'Accent Primary', type: 'text', default: '#8b5cf6' },
            'accent-primary-light': {
              label: 'Accent Primary Light',
              type: 'text',
              default: '#ede9fe',
            },
            'dark-accent-primary': {
              label: 'Dark Accent Primary',
              type: 'text',
              default: '#7c3aed',
            },
            'dark-accent-primary-light': {
              label: 'Dark Accent Primary Light',
              type: 'text',
              default: '#2e1065',
            },
            'secondary-primary': {
              label: 'Secondary Primary',
              type: 'text',
              default: '#0ea5e9',
            },
            'secondary-primary-light': {
              label: 'Secondary Primary Light',
              type: 'text',
              default: '#e0f2fe',
            },
            'dark-secondary-primary': {
              label: 'Dark Secondary Primary',
              type: 'text',
              default: '#0284c7',
            },
            'dark-secondary-primary-light': {
              label: 'Dark Secondary Primary Light',
              type: 'text',
              default: '#082f49',
            },
          },
        },
        unit: {
          label: 'Unit Config',
          type: 'object',
          children: {
            currency: {
              label: 'Currency',
              type: 'object',
              children: {
                prefix: { label: 'Prefix', type: 'text', default: 'PHP ' },
                suffix: { label: 'Suffix', type: 'text', default: '' },
              },
            },
            label: {
              label: 'Labels',
              type: 'object',
              children: {
                current: { label: 'Current', type: 'text', default: 'Spent' },
                remaining: { label: 'Remaining', type: 'text', default: 'to go' },
                target: { label: 'Target', type: 'text', default: 'Goal' },
              },
            },
          },
        },
      },
    },
  },
};

export const thumbnail = FrequencySinglePreview;
