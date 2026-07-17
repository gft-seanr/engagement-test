import FormPreview from '~/admin/components/builder/preview/form/FormPreview.vue';

export const category = 'forms';

export const DEFAULT_REDEEM_SCHEMA = [
  {
    $el: 'h1',
    children: 'Redeem',
    attrs: {
      class: 'text-3xl font-bold mb-4',
    },
  },
  {
    $formkit: 'text',
    name: 'voucher',
    id: 'voucher',
    label: 'Promo Code',
    validation: 'required|length:10,10',
    placeholder: 'XXXXXXXX',
  },
  {
    $formkit: 'text',
    name: 'mobile',
    id: 'mobile',
    label: 'Mobile Number',
    validation: [['required'], ['matches', '/^(09)[0-9]{9}$/']],
    placeholder: '09XX-XXX-XXXX',
    validationMessages: {
      matches: 'Please enter a valid Philippine mobile number.',
    },
  },
  {
    $formkit: 'text',
    name: 'retypemobile',
    id: 'retypemobile',
    label: 'Retype Mobile Number',
    validation: 'required|confirm:mobile',
    placeholder: '09XX-XXX-XXXX',
    'validation-messages': {
      required: 'Please retype your mobile number.',
      confirm:
        'Mobile number do not match the one entered in the previous field. Please check and try again.',
    },
  },
  {
    $formkit: 'submit',
    type: 'submit',
    id: 'submit',
    name: 'submit',
    label: 'Redeem',
    disabled: '$disabled',
    children: {
      if: '$disabled',
      then: {
        $el: 'span',
        attrs: {
          class:
            'w-6 h-6 border-2 border-surface-1 border-r-transparent mr-2 rounded-full animate-spin',
        },
      },
      else: '$label',
    },
  },
];

export const properties = {
  schema: {
    root: true,
    default: DEFAULT_REDEEM_SCHEMA,
    editor: {
      group: 'Fields',
      label: 'Form Fields',
      type: 'form-schema',
    },
  },
  alert: {
    root: true,
    default: {
      component: 'alert-card',
      map: {},
    },
    editor: {
      group: 'Alert',
      label: 'Alert',
      type: 'alert-map',
    },
  },
};

export const thumbnail = FormPreview;
