import { useCallback } from 'react';
import { useAppContext } from '../context/useAppContext.js';

export function useGenericFlow(apiMethod) {
  const {
    addLog,
    setApiResponse,
    setApiInput,
    setDesignVariants,
    setIsLoading,
    saveHistoryEntry,
  } = useAppContext();

  const execute = useCallback(
    async (input) => {
      setIsLoading(true);
      setApiResponse(null);
      setDesignVariants([]);
      setApiInput(input);

      const startTime = Date.now();
      addLog(`Starting API call`);

      try {
        const data = await apiMethod(input);
        const timeTaken = Date.now() - startTime;
        addLog(`API call completed in ${timeTaken}ms`);
        addLog(`Response status: ${data.status ?? 'unknown'}`);
        setApiResponse(data);

        // Extract design variants if present
        const variations =
          data.body?.result?.variations ?? data.body?.variations ?? data.result?.variations;
        if (variations?.length) {
          const variants = variations.map((v) => ({
            url: v.variantImageUrl,
            id: v.variantId,
            editLink: v.variantEditLink,
          }));
          setDesignVariants(variants);
          addLog(`Found ${variants.length} variants`);
        }

        // Extract content items if present
        const content = data.body?.content ?? data.body?.result?.content;
        if (content?.length) {
          addLog(`Received ${content.length} content items`);
        }

        // Extract brands if present
        const brands = data.body?.brands ?? data.body?.result?.brands;
        if (brands?.length) {
          addLog(`Received ${brands.length} brands`);
        }

        setIsLoading(false);
        saveHistoryEntry(input, data, [], variations ? variations.map((v) => ({
          url: v.variantImageUrl,
          id: v.variantId,
          editLink: v.variantEditLink,
        })) : []);
        return data;
      } catch (err) {
        const timeTaken = Date.now() - startTime;
        addLog(`API call failed after ${timeTaken}ms: ${err.message}`);
        setApiResponse({ error: err.message });
        setIsLoading(false);
        throw err;
      }
    },
    [apiMethod, addLog, setApiResponse, setApiInput, setDesignVariants, setIsLoading, saveHistoryEntry]
  );

  return { execute };
}
