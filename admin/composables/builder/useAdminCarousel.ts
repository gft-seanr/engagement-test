import { ref, computed } from 'vue';
import type { Router } from 'vue-router';
import { useEventListener } from '@vueuse/core';

export function useAdminCarousel(projects: any[], router: Router, initial = 0) {
  const activeIndex = ref(initial);

  function next() {
    if (activeIndex.value < projects.length - 1) activeIndex.value++;
  }

  function prev() {
    if (activeIndex.value > 0) activeIndex.value--;
  }

  function handleNavigate(to: string) {
    router.push(to);
  }

  function handleCardClick(index: number) {
    activeIndex.value = index;
  }

  const cardStyle = (index: number) =>
    computed(() => ({
      transform: `translateX(${(index - activeIndex.value) * 260}px) scale(${index === activeIndex.value ? 1 : 0.7})`,
      zIndex: 50 - Math.abs(index - activeIndex.value),
    }));

  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Enter') {
      const to = projects[activeIndex.value]?.to;
      if (to) router.push(to);
    }
  });

  return { activeIndex, next, prev, handleNavigate, handleCardClick, cardStyle };
}
