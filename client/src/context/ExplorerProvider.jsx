import React, { useState, useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import { AppContext } from './AppContext.context.js';
import { isQuotaExceededError } from '../storage/IndexedDBStore.js';
import {
  saveToExplorerHistory,
  savePendingToExplorerHistory,
  getExplorerHistory,
  getExplorerHistoryItem,
  updateExplorerHistoryItem,
  deleteExplorerHistoryItem,
  formatExplorerHistoryLabel,
} from '../utils/explorerHistoryStorage.js';

const QUOTA_MSG = 'Storage quota exceeded. Please delete some history items to free up space.';

export function ExplorerProvider({ children }) {
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [apiInput, setApiInput] = useState(null);
  const [designVariants, setDesignVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pollingFlows, setPollingFlows] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [activeFlow, setActiveFlow] = useState('designs-from-prompt');
  const [pendingFlowAction, setPendingFlowAction] = useState(null);
  const [selectedBId, setSelectedBId] = useState('auto');
  const pendingHistoryIdRef = useRef(null);

  const handleStorageError = useCallback((err) => {
    if (isQuotaExceededError(err)) {
      message.error(QUOTA_MSG, 5);
    }
  }, []);

  // Load history on mount. If the most recent pending item matches the active
  // flow, restore the loading UI so the user sees the job is still running.
  useEffect(() => {
    getExplorerHistory()
      .then((all) => {
        setHistory(all);
        const pending = all.find((item) => item.status === 'pending');
        if (pending && pending.flowKey === activeFlow) {
          setApiInput(pending.apiInput);
          setIsLoading(true);
          pendingHistoryIdRef.current = pending.id;
        }
      })
      .catch((err) => {
        handleStorageError(err);
        setHistory([]);
      });
  }, [handleStorageError, activeFlow]);

  const addLog = useCallback((logMessage) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs((prev) => [...prev, { timestamp, message: logMessage }]);
  }, []);

  const clearLogs = useCallback(() => {
    setApiLogs([]);
    setApiResponse(null);
    setApiInput(null);
    setDesignVariants([]);
    setIsLoading(false);
  }, []);

  const resetResultState = useCallback(() => {
    setApiResponse(null);
    setApiInput(null);
    setDesignVariants([]);
    setIsLoading(false);
  }, []);

  const savePendingHistoryEntry = useCallback(
    async (input, flowKey = activeFlow, overrides = {}) => {
      try {
        const id = await savePendingToExplorerHistory(input, flowKey, selectedBId, overrides);
        if (id) {
          pendingHistoryIdRef.current = id;
          const updated = await getExplorerHistory();
          setHistory(updated);
        }
        return id;
      } catch (err) {
        handleStorageError(err);
        console.error('savePendingHistoryEntry failed:', err);
        return null;
      }
    },
    [activeFlow, selectedBId, handleStorageError]
  );

  const saveHistoryEntry = useCallback(
    async (input, response, logs, variants, flowKey = activeFlow) => {
      try {
        const pendingId = pendingHistoryIdRef.current;
        if (pendingId) {
          await updateExplorerHistoryItem(pendingId, {
            apiInput: input,
            apiResponse: response,
            apiLogs: logs,
            designVariants: variants,
            status: response?.error ? 'failed' : 'completed',
          });
          pendingHistoryIdRef.current = null;
        } else {
          await saveToExplorerHistory(input, response, logs, variants, flowKey, selectedBId);
        }
        const updated = await getExplorerHistory();
        setHistory(updated);
        return pendingId;
      } catch (err) {
        handleStorageError(err);
        console.error('saveHistoryEntry failed:', err);
        return null;
      }
    },
    [activeFlow, selectedBId, handleStorageError]
  );

  const startPollingFlow = useCallback((flowKey) => {
    setPollingFlows((prev) => {
      const next = new Set(prev);
      next.add(flowKey);
      return next;
    });
  }, []);

  const stopPollingFlow = useCallback((flowKey) => {
    setPollingFlows((prev) => {
      const next = new Set(prev);
      next.delete(flowKey);
      return next;
    });
  }, []);

  const isFlowPolling = useCallback(
    (flowKey) => pollingFlows.has(flowKey),
    [pollingFlows]
  );

  const loadHistoryItem = useCallback(async (historyId) => {
    const item = await getExplorerHistoryItem(historyId);
    if (!item) return null;
    setApiInput(item.apiInput);
    setApiResponse(item.apiResponse);
    setApiLogs(item.apiLogs || []);
    setDesignVariants(item.designVariants || []);
    return item;
  }, []);

  const updateHistoryEntry = useCallback(async (id, updates) => {
    try {
      const updated = await updateExplorerHistoryItem(id, updates);
      if (updated) {
        const all = await getExplorerHistory();
        setHistory(all);
      }
      return updated;
    } catch (err) {
      handleStorageError(err);
      console.error('updateHistoryEntry failed:', err);
      return null;
    }
  }, [handleStorageError]);

  const removeHistoryEntry = useCallback(async (id) => {
    try {
      const ok = await deleteExplorerHistoryItem(id);
      if (ok) {
        const all = await getExplorerHistory();
        setHistory(all);
      }
      return ok;
    } catch (err) {
      handleStorageError(err);
      console.error('removeHistoryEntry failed:', err);
      return false;
    }
  }, [handleStorageError]);

  const dispatchFlowAction = useCallback((action) => {
    setPendingFlowAction(action);
  }, []);

  const clearPendingFlowAction = useCallback(() => {
    setPendingFlowAction(null);
  }, []);

  const value = {
    apiResponse,
    setApiResponse,
    apiLogs,
    addLog,
    clearLogs,
    apiInput,
    setApiInput,
    designVariants,
    setDesignVariants,
    isLoading,
    setIsLoading,
    isPolling: pollingFlows.size > 0,
    history,
    setHistory,
    savePendingHistoryEntry,
    saveHistoryEntry,
    loadHistoryItem,
    updateHistoryEntry,
    removeHistoryEntry,
    formatHistoryLabel: formatExplorerHistoryLabel,
    activeFlow,
    setActiveFlow,
    resetResultState,
    startPollingFlow,
    stopPollingFlow,
    isFlowPolling,
    pendingFlowAction,
    dispatchFlowAction,
    clearPendingFlowAction,
    selectedBId,
    setSelectedBId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
