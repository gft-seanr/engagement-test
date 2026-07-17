export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:rendered', () => {
    // sets the theme colors
    const { settings } = useSettings();
    const colors = settings.value?.theme?.colors;
    if (colors) {
      useHead({
        style: [
          {
            innerHTML: `
            :root {
              ${Object.entries(colors || {})
                .map(([key, value]) => `${key}: ${value};`)
                .join('\n')}
            }
          `,
          },
        ],
      });
    }
  });

  nuxtApp.hook('app:beforeMount', () => {
    const { settings } = useSettings();
    const colors = settings.value?.theme?.colors;

    // sets the favicon
    const color = colors && colors['--primary'] ? colors['--primary'] : '#a263f0';
    const element = document.createElement('canvas');
    const canvas = element.getContext('2d');

    element.height = 32;
    element.width = 32;

    const firstPath = new Path2D(
      'm2 .97707485c0-.53962321.44771562-.97707485 1-.97707485h26c.5523019 0 1 .43745164 1 .97707485v30.04463505c0 .718002-.766317 1.1908812-1.4299242.8822713l-12.1401516-5.6486147c-.2719697-.1265472-.5878787-.1265472-.8598484 0l-12.14014282 5.6486147c-.66360431.3086099-1.42993298-.1642693-1.42993298-.8822713z'
    );
    const secondPath = new Path2D(
      'm23.8534896 11.3333367 2.1465104 2.1900183c-5.33918 5.0799705-14.6607898 5.0799705-20 .0000034l2.14650335-2.1900251c4.14179655 3.9406934 11.56521945 3.9406934 15.70698625.0000034z'
    );

    if (canvas) {
      // Draw the first path
      canvas.fillStyle = color;
      canvas.fill(firstPath, 'evenodd');

      // Draw the second path
      canvas.fillStyle = '#fff';
      canvas.fill(secondPath, 'evenodd');
    }

    const dataUrl = element.toDataURL('image/png');

    useHead({
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: dataUrl,
        },
        {
          rel: 'apple-touch-icon',
          href: dataUrl,
        },
        {
          rel: 'shortcut icon',
          href: dataUrl,
        },
      ],
    });
  });
});
