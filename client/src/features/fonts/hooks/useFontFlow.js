import { useCallback, useMemo } from 'react';
import { fontsApi } from '~/api/fonts.js';
import { filesApi } from '~/api/files.js';
import { useAppContext } from '~/context/useAppContext.js';
import { useImmediateFlow } from '~/hooks/useImmediateFlow.js';
import { useAsyncJob } from '~/hooks/useAsyncJob.js';

/**
 * Hook for all Font flows.
 * Immediate-response flows use useImmediateFlow.
 * Async job flows (upload-fonts) use useAsyncJob.
 */
export function useFontFlow(flowKey) {
  const {
    addLog,
    setApiResponse,
    setIsLoading,
  } = useAppContext();

  const immediateFlows = useMemo(() => ({
    'get-fonts': {
      submitApi: (input) => fontsApi.getFonts(input),
      onResponse: (data, _input, { addLog: log }) => {
        const fonts = data.body?.data;
        if (fonts?.length) {
          log(`Received ${fonts.length} fonts`);
        } else {
          log('No fonts found');
        }
      },
    },
  }), []);

  const getFontsFlow = useImmediateFlow(
    immediateFlows['get-fonts'].submitApi,
    'get-fonts',
    { onResponse: immediateFlows['get-fonts'].onResponse }
  );

  const uploadFontsJob = useAsyncJob(fontsApi.uploadFonts, 'upload-fonts', {
    flowKey: 'upload-fonts',
    onResult: (data) => {
      const result = data.body?.result ?? data.body;
      if (result?.data) {
        addLog(`Fonts uploaded successfully`);
      } else {
        addLog('Font upload completed');
      }
    },
  });

  const submitUploadFonts = useCallback(
    async (input = {}, webhookEnabled = false) => {
      const { file, ...restInput } = input;

      if (file) {
        try {
          const extension = file.name.split('.').pop()?.toLowerCase() || 'ttf';
          const contentType = file.type || 'font/ttf';
          addLog(`Getting presigned URL for font ${file.name} (${contentType})...`);

          const presignedData = await filesApi.getPresignedUrl({
            type: 'font',
            extension,
            contentType,
            ...(restInput.abstractUserId && { abstractUserId: restInput.abstractUserId }),
          });

          if (presignedData.status !== 200 || !presignedData.body?.uploadUrl) {
            throw new Error('Failed to get presigned URL');
          }

          const uploadUrl = presignedData.body.uploadUrl;
          const uploadHeaders = presignedData.body.headers || {};
          addLog(`Presigned URL received. Uploading ${file.name} to S3...`);

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

          addLog(`Font uploaded to S3 successfully.`);

          // Step 3: Submit async uploadFonts job with the uploadedURL
          return uploadFontsJob.submit({ uploadedURL: uploadUrl, ...restInput }, webhookEnabled);
        } catch (err) {
          addLog(`Font upload failed: ${err.message}`);
          setApiResponse({ error: err.message });
          setIsLoading(false);
          throw err;
        }
      }

      // No file, pass through directly
      return uploadFontsJob.submit(restInput, webhookEnabled);
    },
    [addLog, uploadFontsJob, setApiResponse, setIsLoading]
  );

  const submit = useCallback(
    (input, webhookEnabled) => {
      switch (flowKey) {
        case 'get-fonts':
          return getFontsFlow.submit(input);
        case 'upload-fonts':
          return submitUploadFonts(input, webhookEnabled);
        default:
          throw new Error(`Unknown font flow: ${flowKey}`);
      }
    },
    [flowKey, getFontsFlow, submitUploadFonts]
  );

  return { submit, handleWebhookEvent: uploadFontsJob.handleWebhookEvent, stopPolling: uploadFontsJob.stopPolling };
}
