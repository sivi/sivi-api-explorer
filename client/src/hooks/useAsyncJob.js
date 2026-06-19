import { useCallback } from 'react';
import { useAppContext } from '../context/useAppContext.js';
import { usePolling } from './usePolling.js';
import { coreApi } from '../api/core.js';

/**
 * Generic hook for async job flows: POST -> requestId -> poll -> result.
 * Extracts the common polling pattern used by designs-from-prompt, designs-from-content,
 * content-from-prompt, extract-brand, etc.
 *
 * @param {Function} submitApi - POST function that returns { body: { requestId } }
 * @param {string} endpointLabel - Human-readable label for logging
 * @param {Object} options
 * @param {Function} options.onResult - (responseData) => void, called when job completes
 * @param {Function} options.onError - (error) => void, called on failure
 * @param {Function} options.extractRequestId - Optional custom requestId extractor
 * @param {Function} options.pollApi - Optional custom status checker (default: coreApi.getRequestStatus)
 */
export function useAsyncJob(submitApi, endpointLabel, options = {}) {
  const {
    apiLogs,
    addLog,
    setApiResponse,
    setApiInput,
    setIsLoading,
    setIsPolling,
  } = useAppContext();

  const { start: startPolling, stop: stopPolling } = usePolling();

  const { onResult, onError, extractRequestId, pollApi = coreApi.getRequestStatus } = options;

  const extractId = useCallback(
    (data) => {
      if (extractRequestId) return extractRequestId(data);
      return (
        data?.body?.requestId ??
        data?.requestId ??
        data?.data?.requestId ??
        data?.result?.requestId
      );
    },
    [extractRequestId]
  );

  const handleCompletion = useCallback(
    (data, originalInput, allLogs) => {
      setApiResponse(data);
      setIsPolling(false);
      setIsLoading(false);
      addLog('Job completed!');
      allLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        message: 'Job completed!',
      });
      if (onResult) {
        try {
          onResult(data, originalInput, allLogs);
        } catch (err) {
          addLog(`onResult callback error: ${err.message}`);
        }
      }
    },
    [setApiResponse, setIsPolling, setIsLoading, addLog, onResult]
  );

  const handleFailure = useCallback(
    (message, allLogs) => {
      addLog(message);
      setIsPolling(false);
      setIsLoading(false);
      allLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        message,
      });
      if (onError) onError(new Error(message));
    },
    [addLog, setIsPolling, setIsLoading, onError]
  );

  const pollStatus = useCallback(
    (requestId, originalInput, allLogs = []) => {
      setIsPolling(true);
      let pollCount = 0;

      const check = async () => {
        pollCount++;
        addLog(`Polling job status (attempt ${pollCount})...`);

        try {
          const data = await pollApi(requestId);
          addLog(`Status check response: ${data.body?.status || 'unknown'}`);
          allLogs.push({
            timestamp: new Date().toLocaleTimeString(),
            message: `Status check response: ${data.body?.status || 'unknown'}`,
          });

          if (data.status === 200 && data.body?.status === 'completed') {
            handleCompletion(data, originalInput, allLogs);
            return false;
          }

          if (data.status !== 200) {
            handleFailure(`API error: Status ${data.status}. Stopping polling.`, allLogs);
            return false;
          }

          if (data.body?.status === 'failed' || data.body?.status === 'error') {
            handleFailure(`Job failed: ${data.body?.status}. Stopping polling.`, allLogs);
            return false;
          }

          const nextDelay = pollCount === 1 ? 45000 : pollCount === 2 ? 20000 : 10000;
          addLog(`Next status check in ${nextDelay / 1000} seconds...`);
          return true;
        } catch (err) {
          handleFailure(`Polling error: ${err.message}. Stopping polling.`, allLogs);
          return false;
        }
      };

      setTimeout(() => {
        startPolling(check, 10000);
      }, 5000);
    },
    [setIsPolling, addLog, pollApi, handleCompletion, handleFailure, startPolling]
  );

  const handleWebhookEvent = useCallback(
    (data) => {
      addLog('Webhook event received from server.');
      const status = data.body?.status ?? data.status;

      if (status === 'completed') {
        addLog('Job completed via webhook!');
        const normalised = data.body
          ? data
          : { status: 200, body: { status: 'completed', result: data.result } };
        setApiResponse(normalised);
        setIsLoading(false);
        if (onResult) {
          try {
            onResult(normalised);
          } catch (err) {
            addLog(`onResult callback error: ${err.message}`);
          }
        }
      } else if (status === 'failed' || status === 'error') {
        addLog(`Job failed via webhook: ${status}`);
        setIsLoading(false);
        if (onError) onError(new Error(`Job failed: ${status}`));
      } else {
        addLog(`Webhook event status: ${status}`);
      }
    },
    [addLog, setApiResponse, setIsLoading, onResult, onError]
  );

  const submit = useCallback(
    async (formData, webhookEnabled = false) => {
      setIsLoading(true);
      setApiResponse(null);
      setApiInput(formData);

      const activeWebhookUrl = localStorage.getItem('webhookUrl');
      const useWebhook = webhookEnabled && !!activeWebhookUrl;
      const requestBody = useWebhook ? { ...formData, webhookUrl: activeWebhookUrl } : formData;

      if (useWebhook) {
        addLog(`Webhook enabled — results will be delivered to: ${activeWebhookUrl}`);
      }

      const startTime = Date.now();
      addLog(`Starting API call to ${endpointLabel}`);

      try {
        const data = await submitApi(requestBody);
        const timeTaken = Date.now() - startTime;
        addLog(`API call completed in ${timeTaken}ms`);
        addLog(`Response status: ${data.status ?? 'unknown'}`);
        setApiResponse(data);

        const requestId = extractId(data);
        const queueWaitTime = data?.body?.queueWaitTime ?? data?.queueWaitTime ?? 0;
        const httpStatus = data?.status ?? data?.httpStatus ?? 200;

        addLog(`Response keys: ${Object.keys(data || {}).join(', ')}`);
        if (requestId) {
          addLog(`Extracted requestId: ${requestId}`);
        }

        if (httpStatus === 200 && requestId) {
          addLog(`Job queued. Request ID: ${requestId}`);
          addLog(`Queue wait time: ${Math.round((queueWaitTime || 0) / 1000)} seconds`);

          if (useWebhook) {
            addLog('Webhook mode active — skipping polling. Waiting for webhook delivery.');
            setIsLoading(false);
          } else {
            const initialLogs = [...(apiLogs || [])];
            initialLogs.push({
              timestamp: new Date().toLocaleTimeString(),
              message: 'Starting status polling in 5 seconds...',
            });
            addLog('Starting status polling in 5 seconds...');
            pollStatus(requestId, formData, initialLogs);
          }
        } else {
          addLog(
            `Job failed or returned error (status: ${httpStatus}, requestId: ${requestId ?? 'none'})`
          );
          setIsLoading(false);
          if (onError) onError(new Error(`Job failed with status ${httpStatus}`));
        }
      } catch (err) {
        const timeTaken = Date.now() - startTime;
        addLog(`API call failed after ${timeTaken}ms: ${err.message}`);
        setApiResponse({ error: err.message });
        setIsLoading(false);
        if (onError) onError(err);
      }
    },
    [
      submitApi,
      endpointLabel,
      extractId,
      setIsLoading,
      setApiResponse,
      setApiInput,
      addLog,
      pollStatus,
      apiLogs,
      onError,
    ]
  );

  return { submit, handleWebhookEvent, stopPolling };
}
