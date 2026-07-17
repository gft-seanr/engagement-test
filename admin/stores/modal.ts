import { defineStore } from 'pinia';
import { shallowRef, ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  const component = shallowRef(null);
  const props = ref({});
  const isOpen = ref(false);

  function open(comp: any, propData = {}) {
    component.value = comp;
    props.value = propData;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    setTimeout(() => {
      component.value = null;
      props.value = {};
    }, 300);
  }

  return { component, props, isOpen, open, close };
});
