import { useCallback } from 'react';
import { useAppContext } from '../../../context/useAppContext.js';
import { useAsyncJob } from '../../../hooks/useAsyncJob.js';

/**
 * Shared hook for Sivi design-generation flows (designs-from-prompt, designs-from-content, content-from-prompt).
 * Thin wrapper around useAsyncJob that maps result variations to design variants.
 */
export function useDesignGeneration(apiMethod, endpointLabel) {
  const {
    apiInput,
    addLog,
    setDesignVariants,
    saveHistoryEntry,
  } = useAppContext();

  const onResult = useCallback(
    (data) => {
      const variations = data.body?.result?.variations ?? data.result?.variations;
      if (variations?.length) {
        const variants = variations.map((v) => ({
          url: v.variantImageUrl,
          id: v.variantId,
          editLink: v.variantEditLink,
        }));
        setDesignVariants(variants);
        addLog(`Found ${variants.length} design variants`);
        saveHistoryEntry(apiInput, data, [], variants);
      } else {
        addLog('Job completed but no variations found in payload.');
      }
    },
    [setDesignVariants, saveHistoryEntry, addLog, apiInput]
  );

  const { submit, handleWebhookEvent, stopPolling } = useAsyncJob(
    apiMethod,
    endpointLabel,
    { onResult }
  );

  return { submit, handleWebhookEvent, stopPolling };
}
