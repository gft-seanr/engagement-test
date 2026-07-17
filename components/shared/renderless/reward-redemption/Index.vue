<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';

interface Props {
  programId: string;
  campaignId: string;
  token?: Token;
  alert?: {
    map: AlertMap<RedeemTokenErrorCode>;
  };
}

const { programId, campaignId, token, alert } = defineProps<Props>();
const emit = defineEmits(['onSuccess', 'onError']);

const queryClient = useQueryClient();
const isRedeemSuccessful = ref(false);

const { redeemData, isPending, isError, handleRedeem, alerts } = useRedeemMutation(
  handleRedeemSuccess,
  alert?.map
);

watch(isError, (newVal) => {
  if (newVal && alerts.value.length > 0) {
    emit('onError', alerts.value);
  }
});

function handleRedeemSuccess(data: RedeemTokenData | null) {
  isRedeemSuccessful.value = true;

  queryClient.setQueryData(['tokens', campaignId, programId], (tokenResponse: TokenResponse) => {
    const newTokens = tokenResponse.data?.tokens.map((oldToken) => {
      if (oldToken.tokenId === data?.tokenId) {
        return data;
      }
      return oldToken;
    });

    return {
      ...tokenResponse,
      data: { tokens: newTokens },
    };
  });

  emit('onSuccess', data);
}

function handleClaim() {
  if (!token) return;

  redeemData.value = {
    programId: programId,
    hash: token?.tokenId || '',
  };

  handleRedeem();
}

function resetRedemption() {
  if (!isRedeemSuccessful.value) return;

  isRedeemSuccessful.value = false;
}
</script>
<template>
  <slot
    :handleClaim="handleClaim"
    :isPending="isPending"
    :isError="isError"
    :token="token"
    :alerts="alerts"
    :isRedeemSuccessful="isRedeemSuccessful"
    :resetRedemption="resetRedemption"
  />
</template>
