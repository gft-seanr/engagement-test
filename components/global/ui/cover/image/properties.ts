import CoverImagePreview from '~/admin/components/builder/preview/CoverImagePreview.vue';

export const category = 'media';

export const properties = {
  coverUrl: {
    default: 'https://placehold.co/1920x1080?text=Cover',
    editor: {
      label: 'Image',
      type: 'image-uploader',
    },
  },
};

export const thumbnail = CoverImagePreview;
