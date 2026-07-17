import { defineAsyncComponent } from 'vue';
import InputSkeleton from '~admin/components/admin-ui/skeleton/InputSkeleton.vue';

const lazyLoad = (loader: () => Promise<any>) =>
  defineAsyncComponent({
    loader,
    loadingComponent: InputSkeleton,
    delay: 50,
    timeout: 10000,
    suspensible: false,
  });

export const INPUT_COMPONENTS: Record<string, any> = {
  'image-uploader': lazyLoad(() => import('~admin/components/builder/inputs/ImageUploader.vue')),
  text: lazyLoad(() => import('~admin/components/builder/inputs/TextInput.vue')),
  textarea: lazyLoad(() => import('~admin/components/builder/inputs/TextareaInput.vue')),
  'form-schema': lazyLoad(() => import('~admin/components/builder/inputs/InputFormSchema.vue')),
  object: lazyLoad(() => import('~admin/components/builder/inputs/ObjectInput.vue')),
  alignment: lazyLoad(() => import('~admin/components/builder/inputs/AlignmentSelector.vue')),
  select: lazyLoad(() => import('~admin/components/builder/inputs/SelectInput.vue')),
  'state-select': lazyLoad(() => import('~admin/components/builder/inputs/StateSelect.vue')),
  'alert-configuration': lazyLoad(
    () => import('~admin/components/builder/inputs/AlertConfiguration.vue')
  ),
  'alert-map': lazyLoad(() => import('~admin/components/builder/inputs/AlertMap.vue')),
  spacing: lazyLoad(() => import('~admin/components/builder/inputs/SpacingConfiguration.vue')),
  dimensions: lazyLoad(() => import('~admin/components/builder/inputs/DimensionAttrs.vue')),
  'icon-picker': lazyLoad(() => import('~admin/components/builder/inputs/IconPicker.vue')),
  number: lazyLoad(() => import('~admin/components/builder/inputs/NumberInput.vue')),
  array: lazyLoad(() => import('~admin/components/builder/inputs/ArrayInput.vue')),
  color: lazyLoad(() => import('~admin/components/builder/inputs/ColorInput.vue')),
};
