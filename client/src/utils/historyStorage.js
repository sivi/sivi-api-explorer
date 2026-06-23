import { historyStore } from '../storage/IndexedDBStore.js';

const MAX_HISTORY_ITEMS = 50;

export const saveToHistory = async (apiInput, apiResponse, apiLogs, designVariants, flowKey = 'unknown') => {
  try {
    if (!apiInput) {
      console.warn('Cannot save to history: apiInput is null or undefined', { apiInput, apiResponse, apiLogs, designVariants });
      return null;
    }

    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prompt: apiInput?.prompt || 'No prompt',
      name: '',
      dimensions: apiInput?.dimension || { width: 300, height: 300 },
      type: apiInput?.type || 'unknown',
      subtype: apiInput?.subtype || 'unknown',
      flowKey,
      apiInput,
      apiResponse,
      apiLogs,
      designVariants,
      isFavorite: false,
    };

    const all = await historyStore.getAll('desc');
    const newHistory = [historyItem, ...all].slice(0, MAX_HISTORY_ITEMS);

    for (const item of newHistory) {
      await historyStore.create(item);
    }

    return historyItem.id;
  } catch (error) {
    console.error('Failed to save to history:', error);
    return null;
  }
};

export const getHistory = async () => {
  try {
    return await historyStore.getAll('desc');
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
};

export const getHistoryItem = async (id) => {
  try {
    return await historyStore.get(id);
  } catch (error) {
    console.error('Failed to get history item:', error);
    return null;
  }
};

export const updateHistoryItem = async (id, updates) => {
  try {
    return await historyStore.update(id, updates);
  } catch (error) {
    console.error('Failed to update history item:', error);
    return null;
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    return await historyStore.delete(id);
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return false;
  }
};

export const clearHistory = async () => {
  try {
    await historyStore.deleteAll();
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const formatHistoryLabel = (item) => {
  const date = new Date(item.timestamp);
  const timeStr = date.toLocaleString();
  const promptPreview = item.prompt.length > 30
    ? item.prompt.substring(0, 30) + '...'
    : item.prompt;
  const dimensions = `${item.dimensions.width}x${item.dimensions.height}`;

  return `${promptPreview} | ${dimensions} | ${timeStr}`;
};
