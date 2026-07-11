import { useCallback, useMemo, useState, useEffect } from 'react';
import { fontsApi } from '~/api/fonts.js';
import { filesApi } from '~/api/files.js';
import { useAppContext } from '~/context/useAppContext.js';
import { useImmediateFlow } from '~/hooks/useImmediateFlow.js';
import { useAsyncJob } from '~/hooks/useAsyncJob.js';

/**
 * Hook for all Font flows.
 * Immediate-response flows use useImmediateFlow.
 * Async job flows (upload-fonts) use useAsyncJob.
 * get-fonts supports cursor-based pagination via loadMore.
 */
export function useFontFlow(flowKey) {
  const {
    addLog,
    setApiResponse,
    setIsLoading,
    saveHistoryEntry,
    apiInput,
    apiResponse,
  } = useAppContext();
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setNextCursor(null);
  }, [flowKey]);

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
        const cursor = data.body?.meta?.cursor ?? data.body?.cursor;
        setNextCursor(cursor || null);
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
    onResult: (data, originalInput) => {
      const result = data.body?.result ?? data.body;
      if (result?.data) {
        addLog(`Fonts uploaded successfully`);
      } else {
        addLog('Font upload completed');
      }
      saveHistoryEntry(originalInput ?? apiInput, data, [], [], 'upload-fonts');
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

  const loadMore = useCallback(async () => {
    if (!nextCursor || !apiInput) return;
    setIsLoadingMore(true);
    addLog('Loading more fonts...');
    try {
      const data = await fontsApi.getFonts({ ...apiInput, cursor: nextCursor });
      const newFonts = data.body?.data ?? [];
      const existingFonts = apiResponse?.body?.data ?? [];
      const merged = {
        ...data,
        body: {
          ...(data.body || {}),
          data: [...existingFonts, ...newFonts],
        },
      };
      setApiResponse(merged);
      const cursor = data.body?.meta?.cursor ?? data.body?.cursor;
      setNextCursor(cursor || null);
      addLog(`Loaded ${newFonts.length} more fonts`);
    } catch (err) {
      addLog(`Load more failed: ${err.message}`);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, apiInput, apiResponse, addLog, setApiResponse]);

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

  return {
    submit,
    loadMore: flowKey === 'get-fonts' ? loadMore : undefined,
    hasMore: flowKey === 'get-fonts' && !!nextCursor,
    isLoadingMore: flowKey === 'get-fonts' ? isLoadingMore : false,
    handleWebhookEvent: uploadFontsJob.handleWebhookEvent,
    stopPolling: uploadFontsJob.stopPolling,
    resume: uploadFontsJob.resume,
  };
}
