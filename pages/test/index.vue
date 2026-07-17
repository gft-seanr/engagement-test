<script setup lang="ts">
const props = {
  programs: [
    {
      title: 'Kickstart Mission',
      description: 'Spend atleast P1,000 for your first reward.',
      component: 'category-spend-single-by-tier',
      iconUrl:
        'https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-spend-spark/kickstart-icon.png',
      rewards: {
        spendagain: {
          tier: 0,
          denominationId: 0,
          merchantId: 0,
          value: 500,
          quantity: 1,
          type: 'gift',
          rewardName: 'P500 Cashback Reward',
          merchantName: '',
          targetTitle: 'Kickstart Mission',
          targetDescription: 'Spend atleast P1,000 for your first reward.',
        },
      },
      unit: {
        currency: {
          prefix: '',
          suffix: '',
        },
        label: {
          current: 'Spend',
          target: ['Spend Required', 'Spends Required'],
          remaining: ['Spend to Go', 'Spends to Go'],
        },
      },
      colors: {
        'accent-primary': '#F39C01',
        'accent-primary-light': '#FFDA99',
        'dark-accent-primary': '#F39C01',
        'dark-accent-primary-light': '#ffe1ad0d',
      },
    },
    {
      title: 'Everyday Essentials',
      description: 'Spend at least P2,000 on a single-receipt grocery purchase.',
      component: 'category-spend-single-by-tier',
      iconUrl:
        'https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-spend-spark/kickstart-icon.png',
      rewards: {
        '1': {
          spendagain: {
            tier: 0,
            denominationId: 0,
            merchantId: 0,
            value: 300,
            quantity: 1,
            type: 'gift',
            rewardName: 'P300 Cashback Reward',
            merchantName: '',
            targetDescription: '',
          },
          spendmore: {
            tier: 0,
            denominationId: 0,
            merchantId: 0,
            value: 300,
            quantity: 1,
            type: 'gift',
            rewardName: 'P300 Cashback Reward',
            merchantName: '',
            targetDescription: '',
          },
        },
      },
      unit: {
        currency: {
          prefix: '',
          suffix: '',
        },
        label: {
          current: 'Spend',
          target: ['Spend Required', 'Spends Required'],
          remaining: ['Spend to Go', 'Spends to Go'],
        },
      },
      colors: {
        'accent-primary': '#F39C01',
        'accent-primary-light': '#FFDA99',
        'dark-accent-primary': '#F39C01',
        'dark-accent-primary-light': '#ffe1ad0d',
      },
    },
  ],
};

// SchemaRenderer example
const schemaData = {
  isLoggedIn: true,
  userName: 'John Doe',
  showAdminPanel: false,
};

const exampleSchema = [
  {
    $el: 'div',
    attrs: {
      class: 'bg-white rounded-lg shadow-lg p-6 mb-8',
    },
    children: [
      {
        $el: 'h2',
        attrs: { class: 'text-2xl font-bold mb-4 text-primary' },
        children: 'SchemaRenderer Example',
      },
      {
        $el: 'div',
        attrs: { class: 'space-y-4' },
        children: [
          {
            $el: 'div',
            if: 'isLoggedIn',
            attrs: { class: 'p-4 bg-green-50 rounded' },
            children: [
              {
                $el: 'p',
                attrs: { class: 'font-semibold' },
                children: 'Welcome back! You are logged in.',
              },
            ],
          },
          {
            $el: 'div',
            attrs: { class: 'grid grid-cols-2 gap-4' },
            children: [
              {
                $el: 'div',
                attrs: { class: 'border p-4 rounded' },
                children: [
                  {
                    $el: 'h3',
                    attrs: { class: 'font-bold mb-2' },
                    children: 'Card 1',
                  },
                  {
                    $el: 'p',
                    attrs: { class: 'text-gray-600' },
                    children: 'This is dynamically rendered from schema',
                  },
                ],
              },
              {
                $el: 'div',
                attrs: { class: 'border p-4 rounded' },
                children: [
                  {
                    $el: 'h3',
                    attrs: { class: 'font-bold mb-2' },
                    children: 'Card 2',
                  },
                  {
                    $el: 'p',
                    attrs: { class: 'text-gray-600' },
                    children: 'You can nest any HTML structure',
                  },
                ],
              },
            ],
          },
          {
            $el: 'div',
            attrs: { class: 'flex gap-2' },
            children: [
              {
                $cmp: 'NuxtLink',
                props: {
                  to: '/',
                  class: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
                },
                children: 'Go Home',
              },
              {
                $el: 'button',
                attrs: {
                  class: 'px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600',
                },
                on: {
                  click: () => alert('Schema button clicked!'),
                },
                children: 'Click Me',
              },
            ],
          },
        ],
      },
    ],
  },
];
</script>
<template>
  <NuxtLayout name="centered-compact" class="p-6">
    <!-- SchemaRenderer Demo -->
    <SchemaRenderer :schema="exampleSchema" :data="schemaData" />

    <!-- Original test component -->
    <!-- <div class="overflow-hidden border border-neutral-50 p-5">
      <ProgressFrequencySingle :target="5" :current="4" />
    </div> -->
    <!-- <CategorySpendSingleByTier v-bind="props" /> -->
  </NuxtLayout>
</template>
