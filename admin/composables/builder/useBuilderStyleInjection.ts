import { ref, computed, watch, onMounted } from 'vue';

const cssRegenerationTrigger = ref(0);
const lastGeneratedCSS = ref('');

export function useBuilderStyleInjection(campaignConfig: Ref<any>) {
  const MARGIN_PROPS: Record<string, string> = {
    mt: 'margin-top',
    mr: 'margin-right',
    mb: 'margin-bottom',
    ml: 'margin-left',
  } as const;

  const extractClasses = (configString: string) => {
    return {
      textColors: [
        ...new Set([...configString.matchAll(/text-\[#([0-9a-fA-F]+)\]/g)].map((m) => m[1])),
      ],
      bgColors: [
        ...new Set([...configString.matchAll(/bg-\[#([0-9a-fA-F]+)\]/g)].map((m) => m[1])),
      ],
      accentColors: [
        ...new Set([...configString.matchAll(/accent-\[#([0-9a-fA-F]+)\]/g)].map((m) => m[1])),
      ],
      textSizes: [
        ...new Set([...configString.matchAll(/text-\[(\d+(?:px|rem|em))\]/g)].map((m) => m[1])),
      ],
      borderRadius: [
        ...new Set(
          [...configString.matchAll(/rounded-\[(\d+(?:px|rem|em|%))\]/g)].map((m) => m[1])
        ),
      ],
      dimensions: [
        ...new Set([...configString.matchAll(/(w|h)-\[(\d+(?:px|rem|em|%))\]/g)].map((m) => m[0])),
      ],
      margins: [
        ...new Set([...configString.matchAll(/(m[trbl])-\[(-?\d+)px\]/g)].map((m) => m[0])),
      ],
    };
  };

  const generateCSS = (classes: ReturnType<typeof extractClasses>): string => {
    let css = '';

    classes.textColors.forEach((hex) => {
      css += `.text-\\[\\#${hex}\\] { color: #${hex} !important; }\n`;
    });

    classes.bgColors.forEach((hex) => {
      css += `.bg-\\[\\#${hex}\\] { background-color: #${hex} !important; }\n`;
    });

    classes.accentColors.forEach((hex) => {
      css += `.accent-\\[\\#${hex}\\] { accent-color: #${hex} !important; }\n`;
    });

    classes.textSizes.forEach((size) => {
      css += `.text-\\[${size}\\] { font-size: ${size} !important; }\n`;
    });

    classes.borderRadius.forEach((radius) => {
      css += `.rounded-\\[${radius}\\] { border-radius: ${radius} !important; }\n`;
    });

    classes.dimensions.forEach((dimClass) => {
      const match = dimClass.match(/(w|h)-\[(.+)\]/);
      if (match) {
        const prop = match[1] === 'w' ? 'width' : 'height';
        const val = match[2];
        const escapedClass = dimClass.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        css += `.${escapedClass} { ${prop}: ${val} !important; }\n`;
      }
    });

    classes.margins.forEach((marginClass) => {
      const match = marginClass.match(/(m[trbl])-\[(-?\d+)px\]/);
      if (match) {
        const [, prefix, value] = match;
        const escapedClass = marginClass.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        css += `.${escapedClass} { ${MARGIN_PROPS[prefix]}: ${value}px !important; }\n`;
      }
    });

    return css;
  };

  const dynamicStyles = computed(() => {
    const _ = cssRegenerationTrigger.value;

    const configString = JSON.stringify(campaignConfig.value);
    if (!configString) return '';

    const classes = extractClasses(configString);
    const css = generateCSS(classes);

    lastGeneratedCSS.value = css;

    if (import.meta.dev) {
      console.log('🎨 [StyleInjection] CSS generated', {
        trigger: cssRegenerationTrigger.value,
        margins: classes.margins,
        cssLength: css.length,
      });
    }

    return css;
  });

  const ensureStylesInDOM = () => {
    if (typeof document === 'undefined') return;

    let styleEl = document.getElementById('builder-dynamic-styles') as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'builder-dynamic-styles';
      styleEl.setAttribute('type', 'text/css');
      document.head.appendChild(styleEl);
      console.log('✅ [StyleInjection] Created style element');
    }

    const currentCSS = lastGeneratedCSS.value || dynamicStyles.value;

    if (styleEl.textContent !== currentCSS) {
      styleEl.textContent = currentCSS;
      console.log('📝 [StyleInjection] Updated CSS in DOM', {
        length: currentCSS.length,
        rules: currentCSS.split('\n').filter((l) => l.trim()).length,
      });
    }
  };

  watch(
    dynamicStyles,
    () => {
      ensureStylesInDOM();
    },
    { immediate: true, flush: 'post' }
  );

  let intervalId: NodeJS.Timeout | null = null;

  const cleanup = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    const styleEl = document.getElementById('builder-dynamic-styles');
    if (styleEl?.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
  };

  return {
    cleanup,
    ensureStylesInDOM,
  };
}
