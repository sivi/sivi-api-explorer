import { useCallback } from 'react';
import { coreApi } from '~/api/core.js';
import { useAppContext } from '~/context/useAppContext.js';
import { usePolling } from '~/hooks/usePolling.js';

export function useDesignFlow() {
  const {
    apiLogs,
    apiInput,
    addLog,
    setApiResponse,
    setApiInput,
    setDesignVariants,
    setIsLoading,
    setIsPolling,
    saveHistoryEntry,
  } = useAppContext();

  const { start: startPolling, stop: stopPolling } = usePolling();

  const handleWebhookEvent = useCallback(
    (data) => {
      const status = data.body?.status ?? data.status;
      const eventType = data.body?.eventType ?? data.eventType;
      const requestId = data.body?.requestId ?? data.requestId;
      const logParts = [
        'Webhook event:',
        eventType && `eventType=${eventType}`,
        status && `status=${status}`,
        requestId && `requestId=${requestId}`,
      ].filter(Boolean);
      addLog(logParts.join(' '));

      const variations = data.body?.result?.variations ?? data.result?.variations;

      if (status === 'completed') {
        addLog('Design generation completed via webhook!');
        const normalised = data.body
          ? data
          : { status: 200, body: { status: 'completed', result: data.result } };
        setApiResponse(normalised);
        setIsLoading(false);

        if (variations?.length) {
          const variants = variations.map((v) => ({
            url: v.variantImageUrl,
            id: v.variantId,
            editLink: v.variantEditLink,
          }));
          setDesignVariants(variants);
          addLog(`Found ${variants.length} design variants`);

          const logs = [
            { timestamp: new Date().toLocaleTimeString(), message: 'Webhook delivery completed.' },
          ];
          saveHistoryEntry(apiInput, normalised, logs, variants);
        } else {
          addLog('Webhook completed but no variations found in payload.');
        }
      } else if (status === 'failed' || status === 'error') {
        addLog(`Design generation failed via webhook: ${status}`);
        setIsLoading(false);
      } else {
        addLog(`Webhook event status: ${status}`);
      }
    },
    [addLog, setApiResponse, setDesignVariants, setIsLoading, saveHistoryEntry, apiInput]
  );

  const pollStatus = useCallback(
    (requestId, originalInput, allLogs = []) => {
      setIsPolling(true);
      let pollCount = 0;

      const check = async () => {
        pollCount++;
        addLog(`Polling design status (attempt ${pollCount})...`);

        try {
          const data = await coreApi.getRequestStatus(requestId);
          addLog(`Status check response: ${data.body?.status || 'unknown'}`);
          allLogs.push({
            timestamp: new Date().toLocaleTimeString(),
            message: `Status check response: ${data.body?.status || 'unknown'}`,
          });

          if (data.status === 200 && data.body?.status === 'completed') {
            setApiResponse(data);
            setIsPolling(false);
            setIsLoading(false);
            addLog('Design generation completed!');
            allLogs.push({
              timestamp: new Date().toLocaleTimeString(),
              message: 'Design generation completed!',
            });

            if (data.body.result?.variations) {
              const variants = data.body.result.variations.map((v) => ({
                url: v.variantImageUrl,
                id: v.variantId,
                editLink: v.variantEditLink,
              }));
              setDesignVariants(variants);
              addLog(`Found ${variants.length} design variants`);
              allLogs.push({
                timestamp: new Date().toLocaleTimeString(),
                message: `Found ${variants.length} design variants`,
              });
              saveHistoryEntry(originalInput, data, allLogs, variants);
            }
            return false; // stop polling
          }

          if (data.status !== 200) {
            addLog(`API error: Status ${data.status}. Stopping polling.`);
            setIsPolling(false);
            setIsLoading(false);
            return false;
          }

          if (data.body?.status === 'failed' || data.body?.status === 'error') {
            addLog(`Design generation failed: ${data.body?.status}. Stopping polling.`);
            setIsPolling(false);
            setIsLoading(false);
            return false;
          }

          // continue polling with dynamic delays
          const nextDelay = pollCount === 1 ? 45000 : pollCount === 2 ? 20000 : 10000;
          addLog(`Next status check in ${nextDelay / 1000} seconds...`);
          return true; // continue
        } catch (err) {
          addLog(`Polling error: ${err.message}. Stopping polling.`);
          setIsPolling(false);
          setIsLoading(false);
          return false;
        }
      };

      // initial delay of 5s then start polling
      setTimeout(() => {
        startPolling(check, 10000);
      }, 5000);
    },
    [addLog, setApiResponse, setDesignVariants, setIsLoading, setIsPolling, saveHistoryEntry, startPolling]
  );

  const submitDesign = useCallback(
    async (formData, webhookEnabled) => {
      setIsLoading(true);
      setApiResponse(null);
      setDesignVariants([]);
      setApiInput(formData);

      const activeWebhookUrl = localStorage.getItem('webhookUrl');
      const useWebhook = webhookEnabled && !!activeWebhookUrl;
      const requestBody = useWebhook ? { ...formData, webhookUrl: activeWebhookUrl } : formData;

      if (useWebhook) {
        addLog(`Webhook enabled — results will be delivered to: ${activeWebhookUrl}`);
      }

      const startTime = Date.now();
      addLog('Starting API call to /designs-from-prompt');

      try {
        const data = await coreApi.designsFromPrompt(requestBody);
        const timeTaken = Date.now() - startTime;
        addLog(`API call completed in ${timeTaken}ms`);
        addLog(`Response status: ${data.status ?? 'unknown'}`);
        setApiResponse(data);

        if (data.status === 200 && data.body?.requestId) {
          addLog(`Design request queued. Request ID: ${data.body.requestId}`);
          addLog(`Queue wait time: ${data.body.queueWaitTime || 0} seconds`);

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
            pollStatus(data.body.requestId, formData, initialLogs);
          }
        } else {
          addLog('Design generation failed or returned error');
          setIsLoading(false);
        }
      } catch (err) {
        const timeTaken = Date.now() - startTime;
        addLog(`API call failed after ${timeTaken}ms: ${err.message}`);
        setApiResponse({ error: err.message });
        setIsLoading(false);
      }
    },
    [setIsLoading, setApiResponse, setDesignVariants, setApiInput, addLog, pollStatus, apiLogs]
  );

  return { submitDesign, handleWebhookEvent, stopPolling };
}
