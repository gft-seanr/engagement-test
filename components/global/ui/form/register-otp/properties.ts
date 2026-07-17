import OtpPreview from '~/admin/components/builder/preview/form/OtpPreview.vue';

export const category = 'forms';

export const DEFAULT_REGISTER_OTP_SCHEMA = [
  {
    $el: 'h1',
    children: 'Verification',
    attrs: {
      class: 'text-2xl font-bold mb-8',
    },
  },
  {
    $formkit: 'text',
    name: 'otp',
    id: 'otp',
    label: 'Enter Verification Code',
    validation: 'required|length:6,6',
    validationMessages: {
      length: 'Verification code must be 6 digits.',
    },
    validationLabel: 'Verification Code',
    placeholder: 'XXXXXX',
    help: 'We sent a 6-digit verification code to your mobile number.',
    attrs: {
      inputmode: 'numeric',
      autocomplete: 'one-time-code',
    },
    classes: {
      help: 'text-neutral-500 text-pretty',
    },
    sectionsSchema: {
      help: {
        children:
          "$: 'We sent a 6-digit verification code to your mobile number ending in ' + $formkitSlice($mobileno, -4) + '.'",
      },
    },
  },
  {
    $formkit: 'submit',
    type: 'submit',
    id: 'submit',
    name: 'submit',
    label: 'Proceed',
    disabled: '$isPending || $state.valid === false',
    children: {
      if: '$isPending && $state.valid',
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
    default: DEFAULT_REGISTER_OTP_SCHEMA,
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

export const thumbnail = OtpPreview;
