import FormPreview from '~/admin/components/builder/preview/form/FormPreview.vue';

export const category = 'forms';

export const DEFAULT_LOGIN_SCHEMA = [
  {
    $el: 'h1',
    children: 'Login',
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
    name: 'mobileNo',
    id: 'mobileNo',
    label: 'Mobile number',
    validation: 'required|matches:/^(09)[0-9]{9}$/',
    placeholder: '09XX-XXX-XXXX',
    validationMessages: {
      matches: 'Please enter a valid Philippine mobile number.',
    },
  },
  {
    $formkit: 'submit',
    type: 'submit',
    name: 'submit',
    id: 'submit',
    label: 'Log in',
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
      else: 'Log in',
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
    },
  },
  schema: {
    root: true,
    default: DEFAULT_LOGIN_SCHEMA,
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

// export const properties = {
//   type: 'form',
//   schema: {
//     type: 'schema',
//     default: DEFAULT_LOGIN_SCHEMA,
//   },
//   // Dependent component
//   alert: {
//     type: 'component',
//     component: {
//       type: 'select',
//       default: 'alert-card',
//       options: [
//         {
//           name: 'alert-card',
//           path: 'components/global/ui/alert/card',
//         },
//       ],
//     },
//     map: {
//       valueSchema: {
//         type: {
//           type: 'select',
//           options: ['error', 'success', 'warning', 'info'],
//           required: true,
//         },
//         title: {
//           type: 'string',
//           required: false,
//         },
//         description: {
//           type: 'string',
//           required: true,
//         },
//       },
//       default: DEFAULT_LOGIN_ALERT,
//     },
//   },
// };

export const thumbnail = FormPreview;
