import React, { useState, useCallback } from 'react';
import {
  saveToHistory,
  getHistory,
  getHistoryItem,
  formatHistoryLabel,
} from '../utils/historyStorage';
import { AppContext } from './AppContext.context.js';

export function AppProvider({ children }) {
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [apiInput, setApiInput] = useState(null);
  const [designVariants, setDesignVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [history, setHistory] = useState(() => getHistory());
  const [activeFlowKey, setActiveFlowKey] = useState('unknown');

  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs((prev) => [...prev, { timestamp, message }]);
  }, []);

  const clearLogs = useCallback(() => {
    setApiLogs([]);
    setApiResponse(null);
    setApiInput(null);
    setDesignVariants([]);
    setIsPolling(false);
  }, []);

  const saveHistoryEntry = useCallback(
    (input, response, logs, variants) => {
      const id = saveToHistory(input, response, logs, variants, activeFlowKey);
      if (id) setHistory(getHistory());
      return id;
    },
    [activeFlowKey]
  );

  const loadHistoryItem = useCallback((historyId) => {
    const item = getHistoryItem(historyId);
    if (!item) return null;
    setApiInput(item.apiInput);
    setApiResponse(item.apiResponse);
    setApiLogs(item.apiLogs || []);
    setDesignVariants(item.designVariants || []);
    return item;
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
    isPolling,
    setIsPolling,
    history,
    setHistory,
    saveHistoryEntry,
    loadHistoryItem,
    formatHistoryLabel,
    activeFlowKey,
    setActiveFlowKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
