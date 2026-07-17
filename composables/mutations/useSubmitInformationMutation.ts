import { useMutation } from '@tanstack/vue-query';
import { useBase64 } from '@vueuse/core';

export function useSubmitInformationMutation(
  handleSubmitSuccess: (data: SubmitInformationData | null) => void,
  alertMap?: AlertMap<SubmitInformationErrorCode>
) {
  const submitInfoData = ref<Omit<SubmitInformationParams, 'id'>>();

  const campaign = useCampaignState();

  const {
    isPending,
    isError,
    error: errors,
    mutate,
  } = useMutation<SubmitInformationResponse, SubmitInformationError[], SubmitInformationParams>({
    mutationFn: (params) => submitInformation(params),
    onSuccess: ({ data }) => {
      handleSubmitSuccess(data);
    },
    networkMode: 'always',
  });

  const alerts = useAlertMap(errors, alertMap || DEFAULT_SUBMISSION_ALERTS);

  const isUnauthorized = useUnauthorizedHandler(errors);

  async function handleSubmit() {
    if (!submitInfoData.value) return;

    const processedData = await convertFilesToBase64(submitInfoData.value);

    mutate({
      ...processedData,
      id: campaign.value.id,
    });
  }

  const convertFilesToBase64 = async (data: any) => {
    let mappedInfoData = { ...data };
    mappedInfoData.files = [];

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        // Convert file array to base64 array
        const base64Files = await Promise.all(
          value.map(async (fileItem) => {
            const { base64, promise } = useBase64(fileItem.file);
            await promise.value;

            return {
              name: key,
              filename: fileItem.name,
              contentType: fileItem.file.type,
              b64: base64.value?.split(',')[1] || '', // Remove data URL prefix
            };
          })
        );

        delete mappedInfoData[key];
        mappedInfoData.files.push(...base64Files);
      }
    }

    return mappedInfoData;
  };

  return {
    submitInfoData,
    isPending,
    isError,
    errors,
    alerts,
    isUnauthorized,
    handleSubmit,
  };
}
