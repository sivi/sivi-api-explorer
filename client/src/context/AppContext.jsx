import React, { useState, useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import {
  saveToHistory,
  savePendingToHistory,
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
  const [activeFlow, setActiveFlow] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/explorer') {
      return 'designs-from-content';
    }
    return 'designs-from-prompt';
  });
  const [pendingFlowAction, setPendingFlowAction] = useState(null);
  const pendingHistoryIdRef = useRef(null);

  const handleStorageError = useCallback((err) => {
    if (isQuotaExceededError(err)) {
      message.error(QUOTA_MSG, 5);
    }
  }, []);

  useEffect(() => {
    getHistory()
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

  const savePendingHistoryEntry = useCallback(
    async (input, flowKey = activeFlow, overrides = {}) => {
      try {
        const id = await savePendingToHistory(input, flowKey, overrides);
        if (id) {
          pendingHistoryIdRef.current = id;
          const updated = await getHistory();
          setHistory(updated);
        }
        return id;
      } catch (err) {
        handleStorageError(err);
        console.error('savePendingHistoryEntry failed:', err);
        return null;
      }
    },
    [activeFlow, handleStorageError]
  );

  // flowKey defaults to activeFlow, but background jobs override it
  // with their original flow so history items are tagged correctly.
  const saveHistoryEntry = useCallback(
    async (input, response, logs, variants, flowKey = activeFlow) => {
      try {
        const pendingId = pendingHistoryIdRef.current;
        if (pendingId) {
          await updateHistoryItem(pendingId, {
            apiInput: input,
            apiResponse: response,
            apiLogs: logs,
            designVariants: variants,
            status: response?.error ? 'failed' : 'completed',
          });
          pendingHistoryIdRef.current = null;
        } else {
          await saveToHistory(input, response, logs, variants, flowKey);
        }
        const updated = await getHistory();
        setHistory(updated);
        return pendingId;
      } catch (err) {
        handleStorageError(err);
        console.error('saveHistoryEntry failed:', err);
        return null;
      }
    },
    [activeFlow, handleStorageError]
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
    formatHistoryLabel,
    activeFlow,
    setActiveFlow,
    resetResultState,
    startPollingFlow,
    stopPollingFlow,
    isFlowPolling,
    pendingFlowAction,
    dispatchFlowAction,
    clearPendingFlowAction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
