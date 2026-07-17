export const getButtonPresets = () => ({
  primarySubmit: {
    id: crypto.randomUUID(),
    $formkit: 'submit',
    type: 'submit',
    name: 'submit',
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
  // secondaryButton: { ... }
});
