import { useCallback } from 'react';
import { coreApi } from '~/api/core.js';
import { useAppContext } from '~/context/useAppContext.js';

/**
 * Hook for Content from Prompt.
 * Immediate-response flow (no polling). Returns content items directly.
 */
export function useContentFlow() {
  const {
    addLog,
    setApiResponse,
    setApiInput,
    setIsLoading,
    savePendingHistoryEntry,
    saveHistoryEntry,
    activeFlow,
  } = useAppContext();

  const submit = useCallback(
    async (formData) => {
      setIsLoading(true);
      setApiResponse(null);
      setApiInput(formData);

      await savePendingHistoryEntry(formData, activeFlow);

      const startTime = Date.now();
      addLog('Starting API call to /content-from-prompt');

      try {
        const data = await coreApi.contentFromPrompt(formData);
        const timeTaken = Date.now() - startTime;
        addLog(`API call completed in ${timeTaken}ms`);
        addLog(`Response status: ${data.status ?? 'unknown'}`);
        setApiResponse(data);

        const content = data.body?.content ?? data.body?.result?.content;
        if (content?.length) {
          addLog(`Received ${content.length} content items`);
        }

        setIsLoading(false);
        saveHistoryEntry(formData, data, [], []);
        return data;
      } catch (err) {
        const timeTaken = Date.now() - startTime;
        addLog(`API call failed after ${timeTaken}ms: ${err.message}`);
        setApiResponse({ error: err.message });
        setIsLoading(false);
        saveHistoryEntry(formData, { error: err.message }, [], []);
        throw err;
      }
    },
    [addLog, setApiResponse, setApiInput, setIsLoading, savePendingHistoryEntry, saveHistoryEntry, activeFlow]
  );

  return { submit };
}
