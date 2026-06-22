import { useCallback, useMemo } from 'react';
import { mediaApi } from '../../../api/media.js';
import { filesApi } from '../../../api/files.js';
import { useAppContext } from '../../../context/useAppContext.js';
import { useImmediateFlow } from '../../../hooks/useImmediateFlow.js';
import { useAsyncJob } from '../../../hooks/useAsyncJob.js';

/**
 * Hook for all Media flows.
 * Immediate-response flows use useImmediateFlow.
 * Async job flows (generate-media) use useAsyncJob.
 */
export function useMediaFlow(flowKey) {
  const {
    addLog,
    setApiResponse,
    setApiInput,
    setIsLoading,
    saveHistoryEntry,
  } = useAppContext();

  const immediateFlows = useMemo(() => ({
    'get-media': {
      submitApi: (input) => mediaApi.getMedia(input),
      onResponse: (data, _input, { addLog: log }) => {
        const media = data.body?.media ?? data.body?.result?.media;
        if (media?.length) {
          log(`Received ${media.length} media assets`);
        } else {
          log('No media assets found');
        }
      },
    },
    'create-media': {
      submitApi: (input) => mediaApi.createMedia(input),
      onResponse: (data, _input, { addLog: log }) => {
        const mId = data.body?.media?.mId ?? data.body?.result?.media?.mId;
        if (mId) log(`Media created. ID: ${mId}`);
        else log('Media creation completed');
      },
    },
    // create-media with file is handled by submitCreateMedia below
    'update-media': {
      submitApi: (input) => mediaApi.updateMedia(input),
      onResponse: (data, _input, { addLog: log }) => {
        const mId = data.body?.media?.mId ?? data.body?.result?.media?.mId;
        if (mId) log(`Media updated. ID: ${mId}`);
        else log('Media update completed');
      },
    },
    'delete-media': {
      submitApi: (input) => mediaApi.deleteMedia(input),
      onResponse: (data, _input, { addLog: log }) => {
        const deletedCount = data.body?.deletedCount ?? data.body?.result?.deletedCount;
        log(deletedCount !== undefined ? `Deleted ${deletedCount} media asset(s)` : 'Delete completed');
      },
    },
  }), []);

  const getMediaFlow = useImmediateFlow(
    immediateFlows['get-media'].submitApi,
    'get-media',
    { onResponse: immediateFlows['get-media'].onResponse }
  );

  const submitCreateMedia = useCallback(
    async (input = {}) => {
      setIsLoading(true);
      setApiResponse(null);

      // Strip file from input for history saving
      const { file, ...restInput } = input;
      setApiInput(restInput);

      const startTime = Date.now();
      addLog('Starting API call: create-media');

      try {
        let createPayload = restInput;

        if (file) {
          // Step 1: Get presigned URL
          const extension = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
          const contentType = file.type || 'image/jpeg';
          addLog(`Getting presigned URL for ${file.name} (${contentType})...`);

          const presignedData = await filesApi.getPresignedUrl({
            type: restInput.type,
            extension,
            contentType,
            ...(restInput.bId && { bId: restInput.bId }),
            ...(restInput.abstractUserId && { abstractUserId: restInput.abstractUserId }),
          });

          if (presignedData.status !== 200 || !presignedData.body?.uploadUrl) {
            throw new Error('Failed to get presigned URL');
          }

          const uploadUrl = presignedData.body.uploadUrl;
          const uploadHeaders = presignedData.body.headers || {};
          addLog(`Presigned URL received. Uploading ${file.name} to S3...`);

          // Step 2: Upload file to S3
          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': uploadHeaders['Content-Type'] || contentType,
            },
            body: file,
          });

          if (!uploadResponse.ok) {
            throw new Error(`S3 upload failed: ${uploadResponse.status}`);
          }

          addLog(`File uploaded to S3 successfully.`);

          // Step 3: Create media with the uploadUrl
          createPayload = { ...restInput, uploadUrl };
        }

        const data = await mediaApi.createMedia(createPayload);
        const timeTaken = Date.now() - startTime;
        addLog(`API call completed in ${timeTaken}ms`);
        addLog(`Response status: ${data.status ?? 'unknown'}`);

        const mId = data.body?.media?.mId ?? data.body?.result?.media?.mId;
        if (mId) addLog(`Media created. ID: ${mId}`);
        else addLog('Media creation completed');

        setApiResponse(data);
        setIsLoading(false);
        saveHistoryEntry(restInput, data, [], []);
        return data;
      } catch (err) {
        const timeTaken = Date.now() - startTime;
        addLog(`API call failed after ${timeTaken}ms: ${err.message}`);
        setApiResponse({ error: err.message });
        setIsLoading(false);
        throw err;
      }
    },
    [addLog, setApiResponse, setApiInput, setIsLoading, saveHistoryEntry]
  );

  const updateMediaFlow = useImmediateFlow(
    immediateFlows['update-media'].submitApi,
    'update-media',
    { onResponse: immediateFlows['update-media'].onResponse }
  );

  const deleteMediaFlow = useImmediateFlow(
    immediateFlows['delete-media'].submitApi,
    'delete-media',
    { onResponse: immediateFlows['delete-media'].onResponse }
  );

  const generateMediaJob = useAsyncJob(mediaApi.generateMedia, 'generate-media', {
    onResult: (data) => {
      const media = data.body?.result?.media ?? data.body?.media;
      if (media) {
        addLog(`Generated media: ${media.mId || 'unknown'}`);
      } else {
        addLog('Media generation completed');
      }
    },
  });

  const submit = useCallback(
    (input, webhookEnabled) => {
      switch (flowKey) {
        case 'get-media':
          return getMediaFlow.submit(input);
        case 'create-media':
          return submitCreateMedia(input);
        case 'update-media':
          return updateMediaFlow.submit(input);
        case 'delete-media':
          return deleteMediaFlow.submit(input);
        case 'generate-media':
          return generateMediaJob.submit(input, webhookEnabled);
        default:
          throw new Error(`Unknown media flow: ${flowKey}`);
      }
    },
    [
      flowKey,
      getMediaFlow,
      submitCreateMedia,
      updateMediaFlow,
      deleteMediaFlow,
      generateMediaJob,
    ]
  );

  return { submit, handleWebhookEvent: generateMediaJob.handleWebhookEvent };
}
