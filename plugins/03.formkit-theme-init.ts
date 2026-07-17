import { plugin, defaultConfig } from '@formkit/vue';
import { size, sizeValidationMessage } from '../utils/FormKit/custom-rules';

import { rootClasses as rootClasses1 } from '~/assets/formkit-themes/formkit-theme-1';
import { rootClasses as rootClasses2 } from '~/assets/formkit-themes/formkit-theme-2';
import { rootClasses as rootClassesMcc } from '~/assets/formkit-themes/formkit-theme-mcc';

export default defineNuxtPlugin((nuxtApp) => {
  // Todo: Import the theme dynamically
  let theme = null;

  switch (nuxtApp.payload.data.settings?.theme?.form) {
    case 'theme-1':
      theme = rootClasses1;
      break;
    case 'theme-2':
      theme = rootClasses2;
      break;
    case 'theme-mcc':
      theme = rootClassesMcc;
      break;
    default:
      theme = rootClasses1;
  }

  // Dynamically configure FormKit config
  nuxtApp.vueApp.use(
    plugin,
    defaultConfig({
      config: {
        rootClasses: theme,
      },
      rules: { size },
      messages: {
        en: {
          validation: {
            size: sizeValidationMessage,
          },
        },
      },
    })
  );
});
