export const useDateCountdown = (
  currentDate: string | number,
  endDate: string | number,
  onComplete: () => void = () => {},
  daysToStartCountdown?: number
) => {
  const currentTime = ref(new Date(currentDate).getTime());
  const endTime = ref(new Date(endDate).getTime());

  const countdownTime = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { pause, resume, isActive } = useIntervalFn(
    () => {
      updateCountdown();
      currentTime.value += 1000;
    },
    1000,
    { immediate: false, immediateCallback: true }
  );

  const updateCountdown = () => {
    const distance = endTime.value - currentTime.value;

    if (distance <= 0) {
      pause();
      onComplete();
      return;
    }

    countdownTime.value.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    countdownTime.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdownTime.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    countdownTime.value.seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysToStartCountdown && countdownTime.value.days >= daysToStartCountdown) {
      pause();
    }
  };

  const countdownInit = () => {
    if (endTime.value < currentTime.value) {
      onComplete();
      return;
    }

    resume();
  };

  countdownInit();

  return { countdownTime, endTime, currentTime, isActive };
};
