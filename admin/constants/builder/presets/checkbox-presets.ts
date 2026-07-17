export const getCheckboxPresets = () => ({
  giftawayConsent: {
    id: crypto.randomUUID(),
    $formkit: 'checkbox',
    name: 'terms',
    label:
      'This promo treats website is managed by Giftaway. By logging in, the information you provide on the site will be subject to the Terms of Service of Giftaway.',
    validation: [['accepted']],
    validationLabel: 'Terms and Conditions',
    validationMessages: {
      accepted: 'Agreeing to the terms and condition is required.',
    },
    'decorator-icon': 'check',
    classes: {
      wrapper: 'flex gap-x-1 items-start',
      label: 'text-xs text-neutral-500 leading-6 text-pretty',
      inner: 'mt-1 shrink-0',
      decorator: 'rounded-xs h-[20px] w-[20px]',
    },
    sectionsSchema: {
      label: {
        children: [
          'This promo treats website is managed by Giftaway. By logging in, the information you provide on the site will be subject to the ',
          {
            $el: 'a',
            attrs: {
              href: 'https://giftaway.ph/terms',
              target: '_blank',
              class: 'underline text-accent-500',
            },
            children: 'Terms of Service',
          },
          ' of Giftaway.',
        ],
      },
    },
  },
});
