import { useMemo } from 'react';
import { coreApi } from '~/api/core.js';
import { useImmediateFlow } from '~/hooks/useImmediateFlow.js';

/**
 * Hook for utility GET flows: Get Design Variants, Request Status.
 * Delegates to useImmediateFlow with flow-specific response parsing.
 */
export function useUtilityFlow(flowKey) {
  const { submitApi, onResponse } = useMemo(() => {
    if (flowKey === 'get-design-variants') {
      return {
        submitApi: (input) => coreApi.getDesignVariants(input.designId),
        onResponse: (data, input, { addLog, setDesignVariants }) => {
          addLog(`Fetched variants for designId: ${input.designId}`);
          const variations = data.body?.variations ?? data.body?.result?.variations;
          if (variations?.length) {
            const variants = variations.map((v) => ({
              url: v.variantImageUrl,
              id: v.variantId,
              editLink: v.variantEditLink,
            }));
            setDesignVariants(variants);
            addLog(`Found ${variants.length} design variants`);
          }
        },
      };
    }
    if (flowKey === 'request-status') {
      return {
        submitApi: (input) => coreApi.getRequestStatus(input.requestId),
        onResponse: (data, input, { addLog }) => {
          addLog(`Checked status for requestId: ${input.requestId}`);
          const status = data.body?.status ?? 'unknown';
          addLog(`Status: ${status}`);
        },
      };
    }
    return { submitApi: () => { throw new Error(`Unknown utility flow: ${flowKey}`); } };
  }, [flowKey]);

  return useImmediateFlow(submitApi, flowKey, {
    onResponse,
    clearVariants: flowKey === 'get-design-variants',
  });
}
