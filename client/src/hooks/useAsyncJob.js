import { useCallback, useRef } from 'react';
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
    startPollingFlow,
    stopPollingFlow,
    activeFlow,
  } = useAppContext();

  const { start: startPolling, stop: stopHttpPolling } = usePolling();
  // Preserve the original form data and requestId across flow switches so
  // that history can be saved correctly even when the user navigates away.
  const originalInputRef = useRef(null);
  const lastRequestIdRef = useRef(null);

  const { onResult, onError, extractRequestId, pollApi = coreApi.getRequestStatus, flowKey } = options;

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

  // Returns true only if the user is currently on this flow's screen.
  // UI state updates (apiResponse, isLoading) are gated by this so that
  // background jobs do not overwrite the current flow's results.
  const isFlowActive = useCallback(
    () => !flowKey || activeFlow === flowKey,
    [flowKey, activeFlow]
  );

  const handleCompletion = useCallback(
    (data, originalInput, allLogs) => {
      // Mark this flow as no longer polling (per-flow tracking).
      if (flowKey) stopPollingFlow(flowKey);
      // Only update UI if the user is still on this flow.
      if (isFlowActive()) {
        setApiResponse(data);
        setIsLoading(false);
      }
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
    [flowKey, stopPollingFlow, isFlowActive, setApiResponse, setIsLoading, addLog, onResult]
  );

  const handleFailure = useCallback(
    (message, allLogs) => {
      addLog(message);
      if (flowKey) stopPollingFlow(flowKey);
      if (isFlowActive()) {
        setIsLoading(false);
      }
      allLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        message,
      });
      if (onError) onError(new Error(message));
    },
    [flowKey, stopPollingFlow, addLog, isFlowActive, setIsLoading, onError]
  );

  const pollStatus = useCallback(
    (requestId, originalInput, allLogs = []) => {
      // Track that this specific flow is now actively polling.
      if (flowKey) startPollingFlow(flowKey);
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

          const nextDelay = 20000;
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
    [flowKey, startPollingFlow, addLog, pollApi, handleCompletion, handleFailure, startPolling]
  );

  const handleWebhookEvent = useCallback(
    (data) => {
      const status = data.body?.status ?? data.status;
      const eventType = data.body?.eventType ?? data.eventType;
      const requestId = data.body?.requestId ?? data.requestId;

      // Guard: silently ignore webhooks meant for other flows.
      // lastRequestIdRef is set during submit() so this instance only
      // handles webhooks matching its own queued job.
      if (lastRequestIdRef.current && requestId && lastRequestIdRef.current !== requestId) {
        return;
      }

      const logParts = [
        'Webhook event:',
        eventType && `eventType=${eventType}`,
        status && `status=${status}`,
        requestId && `requestId=${requestId}`,
      ].filter(Boolean);
      addLog(logParts.join(' '));

      if (status === 'completed') {
        addLog('Job completed via webhook!');
        if (flowKey) {
          stopPollingFlow(flowKey);
          stopHttpPolling();
        }
        const normalised = data.body
          ? data
          : { status: 200, body: { status: 'completed', result: data.result } };
        if (isFlowActive()) {
          setApiResponse(normalised);
          setIsLoading(false);
        }
        if (onResult) {
          try {
            onResult(normalised, originalInputRef.current);
          } catch (err) {
            addLog(`onResult callback error: ${err.message}`);
          }
        }
      } else if (status === 'failed' || status === 'error') {
        addLog(`Job failed via webhook: ${status}`);
        if (flowKey) {
          stopPollingFlow(flowKey);
          stopHttpPolling();
        }
        if (isFlowActive()) {
          setIsLoading(false);
        }
        if (onError) onError(new Error(`Job failed: ${status}`));
      } else {
        addLog(`Webhook event status: ${status}`);
      }
    },
    [addLog, flowKey, stopPollingFlow, stopHttpPolling, isFlowActive, setApiResponse, setIsLoading, onResult, onError]
  );

  const submit = useCallback(
    async (formData, webhookEnabled = false) => {
      setIsLoading(true);
      setApiResponse(null);
      setApiInput(formData);
      originalInputRef.current = formData;

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
          lastRequestIdRef.current = requestId;
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

  const stopPollingAndFlow = useCallback(() => {
    stopHttpPolling();
    if (flowKey) stopPollingFlow(flowKey);
  }, [stopHttpPolling, stopPollingFlow, flowKey]);

  return { submit, handleWebhookEvent, stopPolling: stopPollingAndFlow };
}
