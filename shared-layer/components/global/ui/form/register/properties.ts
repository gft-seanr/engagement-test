import FormPreview from '~/admin/components/builder/preview/form/FormPreview.vue';

export const category = 'forms';

export const DEFAULT_REGISTER_SCHEMA = [
  {
    $el: 'h1',
    children: 'Register',
    attrs: {
      class: 'text-2xl font-bold mb-4',
    },
  },
  {
    $formkit: 'text',
    name: 'code',
    id: 'code',
    label: 'Unique code',
    validation: 'required|length:8,8',
  },
  {
    $formkit: 'text',
    name: 'l4',
    id: 'l4',
    label: 'Last 4 digits of your Security Bank credit card number',
    placeholder: 'XXXX',
    validation: 'required|number|length:4,4',
  },
  {
    $formkit: 'text',
    name: 'mobileNo',
    id: 'mobileNo',
    label: 'Mobile number',
    validation: [['required'], ['matches', '/^(09)[0-9]{9}$/']],
    placeholder: '09XX-XXX-XXXX',
    validationMessages: {
      matches: 'Please enter a valid Philippine mobile number.',
    },
  },
  {
    $formkit: 'submit',
    type: 'submit',
    id: 'submit',
    name: 'submit',
    label: 'Register',
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
  state: {
    root: true,
    default: '',
    editor: {
      label: 'State',
      type: 'state-select',
      options: ['register', 'otp', 'success', 'expired'],
    },
  },
  schema: {
    root: true,
    default: DEFAULT_REGISTER_SCHEMA,
    editor: {
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
      label: 'Alert',
      type: 'alert-map',
    },
  },
};

export const thumbnail = FormPreview;
