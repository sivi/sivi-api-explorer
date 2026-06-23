import { useCallback, useEffect, useMemo, useState } from 'react';
import { coreApi } from '~/api/core.js';
import { useAppContext } from '~/context/useAppContext.js';
import { useImmediateFlow } from '~/hooks/useImmediateFlow.js';

function mapVariations(variations) {
  return variations.map((v) => ({
    url: v.variantImageUrl,
    id: v.variantId,
    editLink: v.variantEditLink,
  }));
}

/**
 * Hook for utility GET flows: Get Design Variants, Request Status.
 * Delegates to useImmediateFlow with flow-specific response parsing.
 * For get-design-variants, also exposes loadMore for cursor-based pagination.
 */
export function useUtilityFlow(flowKey) {
  const { addLog, setApiResponse, setDesignVariants, apiInput } = useAppContext();
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setNextCursor(null);
  }, [flowKey]);

  const { submitApi, onResponse } = useMemo(() => {
    if (flowKey === 'get-design-variants') {
      return {
        submitApi: (input) => coreApi.getDesignVariants(input),
        onResponse: (data, input, ctx) => {
          const idLabel = input.designId
            ? `designId: ${input.designId}`
            : input.workspaceId
              ? `workspaceId: ${input.workspaceId}`
              : input.ideaId
                ? `ideaId: ${input.ideaId}`
                : 'provided identifiers';
          ctx.addLog(`Fetched variants for ${idLabel}`);
          const variations = data.body?.variations ?? data.body?.result?.variations;
          if (variations?.length) {
            const variants = mapVariations(variations);
            ctx.setDesignVariants(variants);
            ctx.addLog(`Found ${variants.length} design variants`);
          }
          const cursor = data.body?.cursor;
          setNextCursor(cursor || null);
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

  const { submit } = useImmediateFlow(submitApi, flowKey, {
    onResponse,
    clearVariants: flowKey === 'get-design-variants',
  });

  const loadMore = useCallback(async () => {
    if (!nextCursor || !apiInput) return;

    const input = { ...apiInput, cursor: nextCursor };
    setIsLoadingMore(true);
    addLog('Loading more variants...');

    try {
      const data = await coreApi.getDesignVariants(input);
      const variations = data.body?.variations ?? data.body?.result?.variations;
      if (variations?.length) {
        const variants = mapVariations(variations);
        setDesignVariants((prev) => [...prev, ...variants]);
        addLog(`Loaded ${variants.length} more design variants`);
      } else {
        addLog('No more variants found');
      }
      const cursor = data.body?.cursor;
      setNextCursor(cursor || null);
      setApiResponse(data);
    } catch (err) {
      addLog(`Load more failed: ${err.message}`);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, apiInput, addLog, setDesignVariants, setApiResponse]);

  return {
    submit,
    loadMore: flowKey === 'get-design-variants' ? loadMore : undefined,
    hasMore: flowKey === 'get-design-variants' && !!nextCursor,
    isLoadingMore: flowKey === 'get-design-variants' ? isLoadingMore : false,
  };
}
