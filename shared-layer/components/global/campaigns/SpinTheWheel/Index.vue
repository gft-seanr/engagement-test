<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// some variables temporarily hardcoded due to time constraints

const isInPlay = ref(false);
const isSpinning = ref(false);
const currentRotation = ref(0);
const wheelSpinnerRef = ref<HTMLElement | null>(null);

interface Reward {
  id: number;
  text: string;
  description: string;
  successFooterMessage: string;
  img: string;
}

const { campaignRewards, totalSegments, alert } = defineProps<{
  campaignRewards: Reward[];
  totalSegments: number;
  alert: {
    component: string;
    map: AlertMap<RedeemTokenErrorCode>;
    props?: Record<string, any>;
  };
}>();

const rewards = ref(
  Array.from({ length: totalSegments }, (_, i) => campaignRewards[i % campaignRewards.length])
);

const segmentCount = computed(() => rewards.value.length);
const segmentAngle = computed(() => 360 / segmentCount.value);

const wheelBackground = computed(() => {
  return `conic-gradient(${rewards.value
    .map((_, index) => {
      const color = index % 2 === 0 ? '#FDBA74' : '#FB923C';
      const startAngle = index * segmentAngle.value;
      const endAngle = startAngle + segmentAngle.value;
      return `${color} ${startAngle}deg ${endAngle}deg`;
    })
    .join(', ')})`;
});

function spinWheel(id: number) {
  if (isSpinning.value) return;

  const matchingIndices = rewards.value.reduce((acc, reward, index) => {
    if (reward.id === id) {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);

  if (matchingIndices.length === 0) {
    // console.error(`Error: No rewards found with ID "${id}".`);
    return;
  }

  const randomIndex = Math.floor(Math.random() * matchingIndices.length);
  const targetIndex = matchingIndices[randomIndex];

  isSpinning.value = true;

  const fullSpins = 5;
  const fullRotation = fullSpins * 360;

  const targetSegmentCenter = segmentAngle.value * targetIndex + segmentAngle.value / 2;
  const targetAngle = 360 - targetSegmentCenter;

  const normalizedCurrentRotation = currentRotation.value % 360;
  const rotationToTarget = (targetAngle - normalizedCurrentRotation + 360) % 360;
  const newRotation = fullRotation + rotationToTarget;

  currentRotation.value += newRotation;
}

const { redeemData, isPending, isError, handleRedeem, alerts } = useRedeemMutation(
  handleRedeemSuccess,
  alert.map
);

function handleRedeemSuccess(data: any) {
  if (!data) return;

  const winningId = data.denominationID;
  spinWheel(winningId);
}

function onButtonPress() {
  if (isPending.value || isSpinning.value) return;

  handleRedeem();
}

const selectedReward = ref<any>(null);
const isModalOpen = ref(false);

function handleBack() {
  isInPlay.value = false;
  selectedReward.value = null;
  currentRotation.value = 0;
  isSpinning.value = false;
  isModalOpen.value = false;
}

watch(isInPlay, async (newVal) => {
  if (newVal) {
    await nextTick();

    const spinner = wheelSpinnerRef.value;
    if (spinner) {
      spinner.addEventListener('transitionend', () => {
        isSpinning.value = false;
        const finalRotation = currentRotation.value % 360;
        spinner.style.transition = 'none';
        currentRotation.value = finalRotation;

        setTimeout(() => {
          spinner.style.transition = 'transform 4s ease-out';
        }, 50);

        const winningIndex = Math.floor(((360 - finalRotation) % 360) / segmentAngle.value);
        const winningReward = rewards.value[winningIndex];

        selectedReward.value = winningReward;
      });
    }
  }
});

watch(isError, (hasError) => {
  if (hasError) {
    isModalOpen.value = true;
  }
});

watch(selectedReward, (newReward) => {
  if (newReward) {
    isModalOpen.value = true;
  }
});

onMounted(() => {
  redeemData.value.code = '';
});

onUnmounted(() => {
  const spinner = wheelSpinnerRef.value;

  if (spinner) {
    spinner.removeEventListener('transitionend', () => {});
  }
});
</script>
<template>
  <div
    class="relative flex h-[calc(100vh-6rem)] flex-col items-center justify-between font-display antialiased"
  >
    <template v-if="!isInPlay">
      <header class="flex w-full items-center justify-center py-4">
        <nuxt-img
          src="https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-pmc/bpi%20logo.webp"
          alt="BPI Logo"
          class="w-[70px] sm:w-[90px]"
        />
      </header>

      <nuxt-img
        src="https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-pmc/playandwinherologo.webp"
        alt="Play and Win Hero Logo"
        class="w-64 sm:w-80"
      />

      <div class="container mt-6 flex w-full flex-col items-center pb-8">
        <h2 class="text-white">Spin the wheel and get a chance to win</h2>
        <ul class="flex w-full list-none items-center justify-center gap-4 px-6 py-4">
          <li
            v-for="reward in campaignRewards"
            :key="reward.id"
            class="flex max-h-56 min-h-56 w-full max-w-sm items-center justify-center rounded-2xl bg-white px-2 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div class="flex h-full flex-col items-center justify-between gap-1 text-center">
              <nuxt-img :src="reward.img" alt="Reward Image" class="w-14 sm:w-20" />
              <h3 class="font-heading text-2xl leading-snug font-extrabold text-gray-900">
                {{ reward.text }}
              </h3>
              <p class="font-inter max-w-[150px] text-xs text-pretty text-neutral-600">
                {{ reward.description }}
              </p>
            </div>
          </li>
        </ul>
        <button @click="isInPlay = true" class="campaign-button">
          <span
            class="font-luckiest-guy text-2xl tracking-wider text-white uppercase [text-shadow:_2px_4px_2px_rgb(245_114_0_/_1.00)] sm:text-3xl"
          >
            Play Now
          </span>
        </button>
      </div>
    </template>

    <template v-else>
      <header class="flex w-full items-center justify-between p-8">
        <img
          src="https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-pmc/bpi%20logo.webp"
          alt="BPI Logo"
          class="w-[70px] sm:w-[90px]"
        />
        <img
          src="https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-pmc/playandwinlogo.webp"
          alt="Play and Win Logo"
          class="w-[120px] sm:w-[150px]"
        />
      </header>

      <div class="relative size-72 [filter:drop-shadow(-2px_17px_5px_rgba(0,0,0,0.75))] sm:size-80">
        <div class="absolute inset-0 rounded-full bg-[#F05305] ring-4 ring-white"></div>
        <div
          class="absolute inset-0"
          :style="{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? 'transform 4s ease-out' : 'none',
          }"
        >
          <svg
            class="absolute inset-0"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="#F99C16"
              stroke-width="6"
              stroke-linecap="round"
              stroke-dasharray="1 35.65"
            />
          </svg>
        </div>
        <div class="absolute inset-[40px] rounded-full ring-4 ring-white"></div>
        <div
          ref="wheelSpinnerRef"
          class="absolute inset-10 rounded-full"
          :style="{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? 'transform 4s ease-out' : 'none',
          }"
        >
          <div class="absolute inset-0 rounded-full" :style="{ background: wheelBackground }"></div>

          <div class="absolute inset-0 rounded-full">
            <div
              v-for="(reward, index) in rewards"
              :key="`reward-${index}`"
              class="absolute bottom-1/2 left-1/2 flex h-1/2 w-24 -translate-x-1/2 items-start justify-center pt-2"
              :style="{
                transformOrigin: 'bottom center',
                transform: `rotate(${segmentAngle * index + segmentAngle / 2}deg)`,
              }"
            >
              <nuxt-img :src="reward.img" class="w-8 sm:w-10" />
            </div>
          </div>
        </div>

        <div
          class="absolute inset-0 flex items-center justify-center"
          :class="{ 'pointer-events-none': isSpinning }"
        >
          <!-- <svg-spin-pointer /> -->
          <svg
            class="size-24 sm:size-28"
            viewBox="0 0 177 236"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="path-1-outside-1_21_232"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0.233093"
              width="177"
              height="236"
              fill="black"
            >
              <rect fill="white" y="0.233093" width="177" height="236" />
              <path
                d="M84.8857 12.028C86.4243 9.63465 89.9223 9.63468 91.4609 12.028L116.77 51.3962C145.799 62.8114 166.347 91.0926 166.347 124.174V147.626L166.341 148.635C165.8 191.344 131.011 225.798 88.1738 225.799C45.337 225.799 10.5476 191.344 10.0068 148.635L10 147.626V124.174C10 91.0926 30.548 62.8105 59.5771 51.3952L84.8857 12.028Z"
              />
            </mask>
            <path
              d="M84.8857 12.028C86.4243 9.63465 89.9223 9.63468 91.4609 12.028L116.77 51.3962C145.799 62.8114 166.347 91.0926 166.347 124.174V147.626L166.341 148.635C165.8 191.344 131.011 225.798 88.1738 225.799C45.337 225.799 10.5476 191.344 10.0068 148.635L10 147.626V124.174C10 91.0926 30.548 62.8105 59.5771 51.3952L84.8857 12.028Z"
              fill="black"
            />
            <path
              d="M84.8857 12.028L93.1054 17.3123L93.1055 17.3121L84.8857 12.028ZM91.4609 12.028L99.6806 6.74383L99.6806 6.74382L91.4609 12.028ZM116.77 51.3962L108.55 56.6804L110.256 59.3351L113.194 60.49L116.77 51.3962ZM166.347 124.174H176.118H166.347ZM166.347 147.626L176.118 147.682L176.118 147.654V147.626H166.347ZM166.341 148.635L176.112 148.759L176.112 148.726L176.112 148.692L166.341 148.635ZM88.1738 225.799V235.57H88.1739L88.1738 225.799ZM10.0068 148.635L0.235371 148.702L0.235565 148.73L0.235929 148.759L10.0068 148.635ZM10 147.626H0.228311V147.659L0.228535 147.692L10 147.626ZM10 124.174H0.228311H10ZM59.5771 51.3952L63.1532 60.489L66.0901 59.3341L67.7968 56.6795L59.5771 51.3952ZM84.8857 12.028L93.1055 17.3121C90.7975 20.9023 85.5491 20.9021 83.2413 17.3122L91.4609 12.028L99.6806 6.74382C94.2956 -1.63273 82.0512 -1.63301 76.666 6.7439L84.8857 12.028ZM91.4609 12.028L83.2412 17.3122L108.55 56.6804L116.77 51.3962L124.989 46.112L99.6806 6.74383L91.4609 12.028ZM116.77 51.3962L113.194 60.49C138.611 70.4851 156.575 95.2431 156.575 124.174H166.347H176.118C176.118 86.942 152.986 55.1378 120.346 42.3023L116.77 51.3962ZM166.347 124.174H156.575V147.626H166.347H176.118V124.174H166.347ZM166.347 147.626L156.575 147.569L156.569 148.579L166.341 148.635L176.112 148.692L176.118 147.682L166.347 147.626ZM166.341 148.635L156.57 148.512C156.097 185.879 125.655 216.027 88.1738 216.027L88.1738 225.799L88.1739 235.57C136.366 235.57 175.503 196.809 176.112 148.759L166.341 148.635ZM88.1738 225.799V216.027C50.6923 216.027 20.2509 185.879 19.7777 148.512L10.0068 148.635L0.235929 148.759C0.844378 196.809 39.9817 235.57 88.1738 235.57V225.799ZM10.0068 148.635L19.7783 148.569L19.7715 147.56L10 147.626L0.228535 147.692L0.235371 148.702L10.0068 148.635ZM10 147.626H19.7717V124.174H10H0.228311V147.626H10ZM10 124.174H19.7717C19.7717 95.243 37.7357 70.4841 63.1532 60.489L59.5771 51.3952L56.0011 42.3014C23.3603 55.1369 0.228312 86.9421 0.228311 124.174H10ZM59.5771 51.3952L67.7968 56.6795L93.1054 17.3123L84.8857 12.028L76.6661 6.74374L51.3575 46.1109L59.5771 51.3952Z"
              fill="black"
              mask="url(#path-1-outside-1_21_232)"
            />
            <path
              d="M88.1738 69.4521C123.177 69.4522 152.805 92.4582 162.767 124.174H166.347V147.626L166.341 148.636C165.8 191.344 131.011 225.799 88.1738 225.799C45.337 225.799 10.5476 191.344 10.0068 148.636L10 147.626L10 124.174H13.5801C23.5415 92.458 53.1706 69.4521 88.1738 69.4521Z"
              fill="#E6480F"
            />
            <path
              d="M88.1738 69.4521C123.177 69.4522 152.805 92.4582 162.767 124.174H166.347V147.626L166.341 148.636C165.8 191.344 131.011 225.799 88.1738 225.799C45.337 225.799 10.5476 191.344 10.0068 148.636L10 147.626L10 124.174H13.5801C23.5415 92.458 53.1706 69.4521 88.1738 69.4521Z"
              fill="url(#paint0_linear_21_232)"
              fill-opacity="0.4"
              style="mix-blend-mode: soft-light"
            />
            <circle cx="88.1735" cy="124.174" r="78.1735" fill="#FF7500" />
            <g clip-path="url(#clip0_21_232)">
              <g filter="url(#filter0_d_21_232)">
                <path
                  d="M84.2111 76.5642C85.7707 73.183 90.5763 73.183 92.136 76.5642L100.693 95.1159C101.329 96.494 102.635 97.4429 104.142 97.6215L124.43 100.027C128.127 100.465 129.612 105.036 126.879 107.564L111.879 121.435C110.765 122.465 110.266 124.001 110.562 125.489L114.543 145.528C115.269 149.18 111.381 152.004 108.132 150.186L90.3049 140.207C88.9807 139.465 87.3664 139.465 86.0421 140.207L68.2149 150.186C64.9657 152.004 61.0779 149.18 61.8035 145.528L65.7852 125.489C66.0809 124.001 65.5821 122.465 64.4679 121.435L49.4684 107.564C46.7346 105.036 48.2196 100.465 51.9174 100.027L72.2054 97.6215C73.7124 97.4429 75.0184 96.494 75.654 95.1159L84.2111 76.5642Z"
                  fill="white"
                />
              </g>
            </g>
            <path
              d="M60.1548 61.6347H116.192C119.285 61.6347 121.152 58.2137 119.48 55.6124L91.4614 12.0278C89.9228 9.6344 86.4242 9.6344 84.8856 12.0278L56.8669 55.6124C55.1947 58.2137 57.0624 61.6347 60.1548 61.6347Z"
              fill="#FF7500"
            />
            <defs>
              <filter
                id="filter0_d_21_232"
                x="48.0622"
                y="74.0283"
                width="80.2227"
                height="85.2526"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="8.52802" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.901961 0 0 0 0 0.282353 0 0 0 0 0.0588235 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_21_232"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_21_232"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_21_232"
                x1="88.1733"
                y1="225.799"
                x2="88.1733"
                y2="69.4521"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-opacity="0" />
                <stop offset="1" />
              </linearGradient>
              <clipPath id="clip0_21_232">
                <rect width="96" height="96" fill="white" transform="translate(40.1735 67.9737)" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <button
        @click="onButtonPress"
        :disabled="isPending || isSpinning"
        class="campaign-button mb-8"
      >
        <span
          class="font-luckiest-guy text-2xl tracking-wider text-white uppercase [text-shadow:_2px_4px_2px_rgb(245_114_0_/_1.00)] sm:text-3xl"
        >
          <template v-if="!isPending && !isSpinning">Spin Now</template>
          <div v-else class="flex items-center justify-center space-x-1">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
        </span>
      </button>
    </template>
  </div>

  <Dialog v-model:open="isModalOpen">
    <DialogContent
      class="rounded-2xl text-primary sm:max-w-xs [&>button:first-of-type]:hidden"
      :onInteractOutside="(e) => e.preventDefault()"
    >
      <DialogTitle class="sr-only"></DialogTitle>
      <DialogDescription class="sr-only"></DialogDescription>

      <template v-if="selectedReward && !isError">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <nuxt-img :src="selectedReward?.img" alt="Reward Image" />
        </div>
        <div
          class="absolute bottom-0 left-1/2 w-full -translate-x-1/2"
          :class="
            selectedReward?.successFooterMessage.length < 110 ? 'translate-y-40' : 'translate-y-50'
          "
        >
          <div class="flex flex-col items-center">
            <Markdown
              class="text-center text-xs leading-7 text-white drop-shadow-sm"
              :content="selectedReward?.successFooterMessage"
              tag="p"
            />
            <button @click="handleBack" class="campaign-button">
              <span
                class="font-luckiest-guy text-2xl tracking-wider text-white uppercase [text-shadow:_2px_4px_2px_rgb(245_114_0_/_1.00)] sm:text-3xl"
                >Back</span
              >
            </button>
          </div>
        </div>
        <section class="space-y-1 pt-16 pb-4 text-center">
          <h2 class="text-xl">You've won a</h2>
          <p class="font-heading text-5xl font-extrabold">{{ selectedReward?.text }}</p>
          <p class="text-sm leading-5">{{ selectedReward?.description }}</p>
        </section>
        <DialogFooter
          class="-mx-6 -mb-6 overflow-hidden rounded-b-2xl border-t border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <Markdown
            class="text-center text-sm leading-7 text-slate-700 dark:text-slate-300"
            :content="selectedReward?.successReminder"
            tag="p"
          />
        </DialogFooter>
      </template>

      <template v-else-if="isError && alerts && alerts.length">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-24 sm:translate-y-32">
          <button @click="handleBack" class="campaign-button">
            <span
              class="font-luckiest-guy text-2xl tracking-wider text-white uppercase [text-shadow:_2px_4px_2px_rgb(245_114_0_/_1.00)] sm:text-3xl"
              >Close</span
            >
          </button>
        </div>
        <section class="w-full">
          <ul class="space-y-3">
            <li
              v-for="(alert, index) in alerts"
              :key="index"
              class="flex items-start gap-x-3 text-sm"
            >
              <Icon name="lucide:triangle-alert" class="mt-0.5 size-5 flex-shrink-0 text-red-500" />
              <div class="space-y-1 text-left">
                <p v-if="alert.title" class="font-extrabold text-gray-900 dark:text-gray-100">
                  {{ alert.title }}
                </p>
                <MDC v-if="alert.description" :value="alert.description" unwrap="div" />
              </div>
            </li>
          </ul>
        </section>
      </template>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
@reference "tailwindcss";

.wheel-segments {
  background-image: conic-gradient(
    #fdba74 0deg,
    #fdba74 45deg,
    #fb923c 45deg,
    #fb923c 90deg,
    #fdba74 90deg,
    #fdba74 135deg,
    #fb923c 135deg,
    #fb923c 180deg,
    #fdba74 180deg,
    #fdba74 225deg,
    #fb923c 225deg,
    #fb923c 270deg,
    #fdba74 270deg,
    #fdba74 315deg,
    #fb923c 315deg,
    #fb923c 360deg
  );
}

.dotted-ring {
  border-radius: 50%;

  background: repeating-conic-gradient(#fdba74 0% 0.8%);
}

.campaign-button {
  @apply mt-4 max-w-sm rounded-full border-[0.5px] border-white bg-[#F89D1D] bg-gradient-to-b from-white/60 to-white/0 px-10 py-2.5 bg-blend-overlay shadow-[0px_8px_0px_4px_rgba(0,0,0,0.75)] ring-4 ring-black transition-all duration-150 ease-in-out active:translate-y-[6px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:grayscale disabled:active:translate-y-0;
}

.dot {
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.overlay-background {
  background:
    url('https://s3.us-east-1.amazonaws.com/assets.giftaway.ph/images/affiliates/bpi-pmc/spinthewheelbg.webp')
      no-repeat center center / cover,
    linear-gradient(to bottom, #da4337 0%, #811b13 100%);
}
</style>
