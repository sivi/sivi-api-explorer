import { useCallback } from 'react';
import { useAppContext } from '../context/useAppContext.js';

/**
 * Generic hook for immediate-response API flows (GET or POST).
 * Handles loading state, logging, response setting, and error handling.
 *
 * @param {Function} submitApi - API function (can be GET or POST)
 * @param {string} endpointLabel - Human-readable label for logging
 * @param {Object} options
 * @param {Function} options.onResponse - (data, input) => void, called on successful response
 * @param {boolean} options.clearVariants - Whether to clear designVariants on submit
 */
export function useImmediateFlow(submitApi, endpointLabel, options = {}) {
  const {
    addLog,
    setApiResponse,
    setApiInput,
    setDesignVariants,
    setIsLoading,
    saveHistoryEntry,
  } = useAppContext();

  const { onResponse, clearVariants = false } = options;

  const submit = useCallback(
    async (input = {}) => {
      setIsLoading(true);
      setApiResponse(null);
      setApiInput(input);
      if (clearVariants) {
        setDesignVariants([]);
      }

      const startTime = Date.now();
      addLog(`Starting API call: ${endpointLabel}`);

      try {
        const data = await submitApi(input);
        const timeTaken = Date.now() - startTime;
        addLog(`API call completed in ${timeTaken}ms`);
        addLog(`Response status: ${data.status ?? 'unknown'}`);

        if (onResponse) {
          try {
            onResponse(data, input, { addLog, setDesignVariants, setApiResponse });
          } catch (err) {
            addLog(`onResponse callback error: ${err.message}`);
          }
        }

        setApiResponse(data);
        setIsLoading(false);
        saveHistoryEntry(input, data, [], []);
        return data;
      } catch (err) {
        const timeTaken = Date.now() - startTime;
        addLog(`API call failed after ${timeTaken}ms: ${err.message}`);
        setApiResponse({ error: err.message });
        setIsLoading(false);
        throw err;
      }
    },
    [submitApi, endpointLabel, onResponse, clearVariants, addLog, setApiResponse, setApiInput, setDesignVariants, setIsLoading, saveHistoryEntry]
  );

  return { submit };
}
