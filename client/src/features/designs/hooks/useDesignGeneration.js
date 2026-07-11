import { useCallback } from 'react';
import { useAppContext } from '~/context/useAppContext.js';
import { useAsyncJob } from '~/hooks/useAsyncJob.js';

/**
 * Shared hook for Sivi design-generation flows (designs-from-prompt, designs-from-content, content-from-prompt).
 * Thin wrapper around useAsyncJob that maps result variations to design variants.
 */
export function useDesignGeneration(apiMethod, endpointLabel, flowKey) {
  const {
    apiInput,
    addLog,
    setDesignVariants,
    saveHistoryEntry,
    activeFlow,
  } = useAppContext();

  const onResult = useCallback(
    (data, originalInput) => {
      const variations = data.body?.result?.variations ?? data.result?.variations;
      const variants = variations?.length
        ? variations.map((v) => ({
            url: v.variantImageUrl,
            id: v.variantId,
            editLink: v.variantEditLink,
            options: v.options,
          }))
        : [];

      if (variants.length) {
        // Only update the design variant grid if the user is still on this
        // flow. History is always saved regardless of the active flow.
        if (!flowKey || activeFlow === flowKey) {
          setDesignVariants(variants);
        }
        addLog(`Found ${variants.length} design variants`);
      } else {
        addLog('Job completed but no variations found in payload.');
      }
      saveHistoryEntry(originalInput ?? apiInput, data, [], variants, flowKey);
    },
    [setDesignVariants, saveHistoryEntry, addLog, apiInput, activeFlow, flowKey]
  );

  const { submit, handleWebhookEvent, stopPolling, resume } = useAsyncJob(
    apiMethod,
    endpointLabel,
    { onResult, flowKey }
  );

  return { submit, handleWebhookEvent, stopPolling, resume };
}
