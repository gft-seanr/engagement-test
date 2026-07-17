import CardPreview from '~/admin/components/builder/preview/CardPreview.vue';

export const properties = {
  rewards: {
    type: Array,
    default: [
      {
        tier: 1,
        title: 'Silver Tier',
        description: 'Spend more to reach Gold!',
      },
      {
        tier: 2,
        title: 'Gold Tier',
        description: 'You are at the top!',
      },
    ],
    editor: {
      label: 'Reward Tiers',
      type: 'array',
      itemSchema: {
        tier: {
          type: 'number',
          label: 'Tier Index',
          default: 1,
        },
        title: {
          type: 'text',
          label: 'Title',
          default: 'New Reward',
        },
        description: {
          type: 'textarea',
          label: 'Description',
          default: '',
        },
      },
    },
  },
};

export const thumbnail = CardPreview;
