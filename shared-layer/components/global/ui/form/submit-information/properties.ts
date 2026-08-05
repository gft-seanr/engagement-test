import FormPreview from '~/admin/components/builder/preview/form/FormPreview.vue';

export const category = 'forms';

export const DEFAULT_SUBMIT_INFORMATION_SCHEMA = [
  {
    $formkit: 'text',
    name: 'fullName',
    id: 'fullName',
    label: 'Full Name',
    validation: 'required',
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
    $formkit: 'email',
    name: 'email',
    id: 'email',
    label: 'Email Address',
    validation: 'required|email',
  },
  {
    $formkit: 'date',
    name: 'dateOfBirth',
    id: 'dateOfBirth',
    label: 'Date of Birth',
    validation: 'required',
  },
  {
    $formkit: 'textarea',
    name: 'fullAddress',
    id: 'fullAddress',
    label: 'Full Address',
    validation: 'required',
  },
  {
    $formkit: 'file',
    name: 'tapeReceipt',
    id: 'tapeReceipt',
    label: 'Image of Tape Receipt',
    validation: 'required|size:10240',
    accept: '.png,.jpg,.jpeg,.heic',
    classes: {
      noFiles: 'text-transparent',
    },
    sectionsSchema: {
      noFiles: {
        $el: 'div',
        attrs: {
          class: 'flex flex-col items-center justify-center px-4 py-6 text-center',
        },
        children: [
          {
            $cmp: 'Icon',
            props: {
              name: 'lucide:image-up',
              size: '42',
              class: 'text-text-secondary',
            },
          },
          {
            $el: 'p',
            attrs: {
              class: 'mt-4 text-xs leading-6 text-text-secondary',
            },
            children:
              'Upload a clear and full image of Maya payment confirmation. Supported file types: jpg, jpeg, png or heic. Maximum file size: 10MB',
          },
        ],
      },
    },
  },
  {
    $formkit: 'file',
    name: 'paymentConfirmation',
    id: 'paymentConfirmation',
    label: 'Image of Maya Payment Confirmation',
    validation: 'required|size:10240',
    accept: '.png,.jpg,.jpeg,.heic',
    classes: {
      noFiles: 'text-transparent',
    },
    sectionsSchema: {
      noFiles: {
        $el: 'div',
        attrs: {
          class: 'flex flex-col items-center justify-center px-4 py-6 text-center',
        },
        children: [
          {
            $cmp: 'Icon',
            props: {
              name: 'lucide:image-up',
              size: '42',
              class: 'text-text-secondary',
            },
          },
          {
            $el: 'p',
            attrs: {
              class: 'mt-4 text-xs leading-6 text-text-secondary',
            },
            children:
              'Upload a clear and full image of Tape receipt. Supported file types: jpg, jpeg, png or heic. Maximum file size: 10MB',
          },
        ],
      },
    },
  },
  {
    $formkit: 'submit',
    type: 'submit',
    id: 'submit',
    name: 'submit',
    label: 'Submit',
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
    default: DEFAULT_SUBMIT_INFORMATION_SCHEMA,
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
