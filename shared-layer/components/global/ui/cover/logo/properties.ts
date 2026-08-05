import LogoImagePreview from '~/admin/components/builder/preview/LogoImagePreview.vue';

export const category = 'media';

export const properties = {
  logoUrl: {
    default: 'https://placehold.co/1920x1080?text=Logo',
    editor: {
      label: 'Image',
      type: 'image-uploader',
    },
  },
};

export const thumbnail = LogoImagePreview;
