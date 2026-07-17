import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const category = 'tracking';

export const properties = {
  rewards: {
    default: [
      {
        tier: 1,
        title: 'Reward 1',
        description: 'Description for reward 1',
      },
      {
        tier: 2,
        title: 'Reward 2',
        description: 'Description for reward 2',
      },
    ],
    editor: {
      group: 'Reward',
      type: 'array',
      itemSchema: {
        tier: {
          type: 'number',
          label: 'Tier',
        },
        title: {
          type: 'text',
          label: 'Title',
        },
        description: {
          type: 'text',
          label: 'Description',
        },
      },
    },
  },
};

export const thumbnail = CardPreview;
