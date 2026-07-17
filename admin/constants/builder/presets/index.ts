import { getCheckboxPresets } from './checkbox-presets';
import { getButtonPresets } from './button-presets';

export { getCheckboxPresets, getButtonPresets };

export const getAllPresets = () => ({
  ...getCheckboxPresets(),
  ...getButtonPresets(),
});
