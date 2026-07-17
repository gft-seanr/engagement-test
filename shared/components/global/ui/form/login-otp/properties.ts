import OtpPreview from '~/admin/components/builder/preview/form/OtpPreview.vue';

export const category = 'forms';

export const DEFAULT_LOGIN_OTP_SCHEMA = [
  {
    $el: 'h1',
    children: 'Login Verification',
    attrs: {
      class: 'text-2xl font-bold mb-4',
    },
  },
  {
    $formkit: 'text',
    name: 'code',
    id: 'code',
    label: 'Verification code',
    validation: 'required|length:6,6',
    help: 'Please enter the 6-digit code sent to your mobile number.',
    sectionsSchema: {
      input: {
        attrs: {
          autofocus: true,
        },
      },
      help: {
        children: "$: 'Please enter the 6-digit code sent to ' + $mobileNo + '.'",
      },
    },
  },
  {
    $formkit: 'submit',
    type: 'submit',
    id: 'submit',
    name: 'submit',
    label: 'Proceed',
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
    },
  },
  schema: {
    root: true,
    default: DEFAULT_LOGIN_OTP_SCHEMA,
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
