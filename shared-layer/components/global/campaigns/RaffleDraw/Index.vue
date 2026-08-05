<script setup lang="ts">
//todo: refactor
import { useMutation } from '@tanstack/vue-query';
const { formData, isPending, isError, error, handleSubmit, raffleResponse } = useDrawRaffle();

function useDrawRaffle() {
  const formData = ref<Record<string, any>>({});
  const route = useRoute();

  const {
    isPending,
    isError,
    error,
    mutate,
    data: raffleResponse,
  } = useMutation({
    mutationFn: (params: any) => raffle(params),
    onSuccess: ({ isSuccessful, data }) => {
      if (isSuccessful) {
      } else {
        // console.error('Failed:', data);
      }
    },
    onError: (error) => {
      // console.error('Error:', error);
    },
  });

  function handleSubmit() {
    mutate({
      targetId: formData.value.target,
      programId: formData.value.program,
      drawCount: formData.value.drawCount,
      id: route.params.id,
    });
  }

  return {
    formData,
    isPending,
    isError,
    error,
    raffleResponse,
    handleSubmit,
  };
}

const {
  isPending: isProgramsPending,
  isError: isProgramsPrograms,
  errors: programsErrors,
  programs,
} = useProgramsQuery();

const programOptions = computed(() => {
  return programs.value.map((program) => {
    return {
      value: program.programId,
      label: program.name,
    };
  });
});

const program = ref();

const {
  isPending: isTargetsPending,
  isError: isTargetsError,
  errors: targetsErrors,
  targets,
} = useTargetsQuery(program);

const targetOptions = computed(() => {
  if (targets.value?.length === 0) {
    return [];
  }

  return targets.value.map((target) => {
    return {
      value: target.targetId,
      label: target.name,
    };
  });
});
</script>

<template>
  <div>
    <FormKit
      type="form"
      v-model="formData"
      ref="formRef"
      :incomplete-message="false"
      :actions="false"
      @submit="handleSubmit"
      :disabled="isPending"
      #default="{ disabled }"
      id="raffleDrawForm"
      name="raffleDrawForm"
    >
      <FormKit
        type="select"
        label="Choose a program"
        name="program"
        :options="programOptions"
        :key="programOptions[0]?.value"
        v-model="program"
        id="programSelect"
      />

      <FormKit
        type="select"
        label="Choose a reward"
        name="target"
        :options="targetOptions"
        :key="targetOptions[0]?.value"
        id="targetSelect"
      />

      <FormKit
        type="number"
        label="Choose number of winners"
        name="drawCount"
        min="0"
        step="1"
        number="integer"
        id="drawCountInput"
      />

      <FormKit type="submit" label="Draw Winners" name="drawWinners" id="submit" />
    </FormKit>

    <div
      v-if="raffleResponse?.isSuccessful && raffleResponse?.data?.tokens"
      class="min-h-400px mt-8 pt-8"
      :class="{
        'border-mercury border-t':
          raffleResponse.isSuccessful || raffleResponse?.data?.tokens.length,
      }"
    >
      <p class="mb-8 text-center font-display text-xl font-bold">
        Raffle Winners ({{ raffleResponse?.data?.tokens.length }})
      </p>

      <div>
        <div
          class="border-mercury mt-4 mb-6 border-b pb-6 text-sm last:pb-8"
          v-for="(data, index) in raffleResponse.data?.tokens"
          :key="index"
        >
          <p class="mb-1 text-lg font-bold">Winner #{{ index + 1 }}</p>
          <p class="mb-6 text-base font-semibold">{{ data.prizeName }}</p>

          <div class="mt-2 flex justify-between">
            <div class="w-5/12 flex-grow pr-2">Registration Code:</div>
            <div class="text-right font-semibold">
              {{ data.registrationCode }}
            </div>
          </div>

          <div class="mt-2 flex justify-between">
            <div class="w-5/12 flex-grow pr-2">Transaction Date:</div>
            <div class="text-right font-semibold">
              <NuxtTime
                :datetime="data.transactionDateTime"
                year="numeric"
                month="short"
                day="numeric"
              />
            </div>
          </div>

          <div class="mt-2 flex justify-between">
            <div class="w-5/12 flex-grow pr-2">Reference Number:</div>
            <div class="text-right font-semibold">
              {{ data.referenceNo }}
            </div>
          </div>

          <div class="mt-2 flex justify-between">
            <div class="w-4/12 pr-2">Prize:</div>
            <div class="flex-grow text-right font-semibold">
              {{ formData.target.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
