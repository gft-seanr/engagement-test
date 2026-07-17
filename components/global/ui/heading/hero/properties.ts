import HeadingPreview from '~/admin/components/builder/preview/HeadingPreview.vue';

export const category = 'content';

export const properties = {
  state: {
    root: true,
    default: '',
    editor: {
      label: 'State',
      type: 'state-select',
    },
  },
  title: {
    default: 'Hero Headline',
    editor: {
      label: 'Title',
      type: 'text', // markdown also
      required: true,
    },
  },

  description: {
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    editor: {
      label: 'Subtext',
      type: 'textarea',
      required: false,
    },
  },

  link: {
    default: {
      destination: '',
      label: '',
    },
    editor: {
      label: 'Link',
      type: 'object',
      children: {
        label: {
          label: 'Button Text',
          type: 'text',
          default: 'Get Started',
        },
        destination: {
          label: 'URL / Link',
          type: 'text',
          default: '#',
          placeholder: 'https://example.com',
        },
      },
    },
  },
  titleColor: {
    default: '',
    editor: {
      label: 'Title Color',
      type: 'color', // Using your shiny new color picker component!
      group: 'Typography', // Optional: groups them nicely in your sidebar
    },
  },
  descriptionColor: {
    default: '',
    editor: {
      label: 'Description Color',
      type: 'color',
      group: 'Typography',
    },
  },
  linkColor: {
    default: '',
    editor: {
      label: 'Link Color',
      type: 'color',
      group: 'Typography',
    },
  },
  alignment: {
    default: 'center',
    editor: {
      group: 'Typography',
      label: 'Text Alignment',
      type: 'alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  },
};

export const thumbnail = HeadingPreview;
