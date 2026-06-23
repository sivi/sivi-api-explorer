import React, { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import {
  saveToHistory,
  getHistory,
  getHistoryItem,
  updateHistoryItem,
  deleteHistoryItem,
  formatHistoryLabel,
} from '../utils/historyStorage';
import { isQuotaExceededError } from '../storage/IndexedDBStore.js';
import { AppContext } from './AppContext.context.js';

const QUOTA_MSG = 'Storage quota exceeded. Please delete some history items to free up space.';

export function AppProvider({ children }) {
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [apiInput, setApiInput] = useState(null);
  const [designVariants, setDesignVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Track which flows are actively polling so multiple background jobs
  // can run in parallel without a single global flag.
  const [pollingFlows, setPollingFlows] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [activeFlowKey, setActiveFlowKey] = useState('unknown');

  const handleStorageError = useCallback((err) => {
    if (isQuotaExceededError(err)) {
      message.error(QUOTA_MSG, 5);
    }
  }, []);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch((err) => {
        handleStorageError(err);
        setHistory([]);
      });
  }, [handleStorageError]);

  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs((prev) => [...prev, { timestamp, message }]);
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

  // flowKey defaults to activeFlowKey, but background jobs override it
  // with their original flow so history items are tagged correctly.
  const saveHistoryEntry = useCallback(
    async (input, response, logs, variants, flowKey = activeFlowKey) => {
      try {
        const id = await saveToHistory(input, response, logs, variants, flowKey);
        if (id) {
          const updated = await getHistory();
          setHistory(updated);
        }
        return id;
      } catch (err) {
        handleStorageError(err);
        console.error('saveHistoryEntry failed:', err);
        return null;
      }
    },
    [activeFlowKey, handleStorageError]
  );

  // Register a flow as actively polling. Multiple flows can be polling
  // simultaneously (e.g. design generation + brand extraction).
  const startPollingFlow = useCallback((flowKey) => {
    setPollingFlows((prev) => {
      const next = new Set(prev);
      next.add(flowKey);
      return next;
    });
  }, []);

  // Unregister a flow from active polling.
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
    const item = await getHistoryItem(historyId);
    if (!item) return null;
    setApiInput(item.apiInput);
    setApiResponse(item.apiResponse);
    setApiLogs(item.apiLogs || []);
    setDesignVariants(item.designVariants || []);
    return item;
  }, []);

  const updateHistoryEntry = useCallback(async (id, updates) => {
    try {
      const updated = await updateHistoryItem(id, updates);
      if (updated) {
        const all = await getHistory();
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
      const ok = await deleteHistoryItem(id);
      if (ok) {
        const all = await getHistory();
        setHistory(all);
      }
      return ok;
    } catch (err) {
      handleStorageError(err);
      console.error('removeHistoryEntry failed:', err);
      return false;
    }
  }, [handleStorageError]);

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
    saveHistoryEntry,
    loadHistoryItem,
    updateHistoryEntry,
    removeHistoryEntry,
    formatHistoryLabel,
    activeFlowKey,
    setActiveFlowKey,
    resetResultState,
    startPollingFlow,
    stopPollingFlow,
    isFlowPolling,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
