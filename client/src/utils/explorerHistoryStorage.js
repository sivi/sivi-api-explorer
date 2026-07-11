import { explorerHistoryStore } from '../storage/ExplorerIndexedDBStore.js';
import { FLOW_KEY_MAP } from '../config/flows.js';

const MAX_HISTORY_ITEMS = 50;

function getFlowLabel(flowKey) {
  return FLOW_KEY_MAP[flowKey] || flowKey || 'Unknown';
}

function generatePromptFromInput(apiInput) {
  if (!apiInput) return '';

  const { prompt, content, description, url, title, type, subtype, fonts, file } = apiInput;

  if (prompt && prompt !== 'No prompt') return prompt;
  if (content) {
    const preview = typeof content === 'string' ? content : content?.text || '';
    return preview ? `Content: ${preview.substring(0, 60)}` : '';
  }
  if (description) return description;
  if (title) return title;
  if (url) return `URL: ${url}`;

  const parts = [];
  if (type && type !== 'unknown') parts.push(type);
  if (subtype && subtype !== 'unknown') parts.push(subtype);
  if (fonts?.length) {
    const fontName = fonts[0].name || fonts[0].fileName || fonts[0].fontName || 'font';
    parts.push(`Font: ${fontName}`);
  }
  if (file) parts.push(`File: ${file.name || file}`);

  return parts.length ? parts.join(' · ') : '';
}

function buildExplorerHistoryItem(apiInput, apiResponse, apiLogs, designVariants, flowKey = 'unknown', bId = 'auto', status = 'completed', overrides = {}) {
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    prompt: apiInput?.prompt || 'No prompt',
    name: '',
    dimensions: apiInput?.dimension || { width: 300, height: 300 },
    type: apiInput?.type || 'unknown',
    subtype: apiInput?.subtype || 'unknown',
    flowKey,
    bId: bId || 'auto',
    apiInput,
    apiResponse,
    apiLogs,
    designVariants,
    isFavorite: false,
    isDisliked: false,
    status,
    ...overrides,
  };
}

async function persistExplorerHistoryItem(item) {
  const all = await explorerHistoryStore.getAll('desc');
  const existingIndex = all.findIndex((i) => i.id === item.id);
  if (existingIndex >= 0) {
    all[existingIndex] = item;
  } else {
    all.unshift(item);
  }
  const newHistory = all.slice(0, MAX_HISTORY_ITEMS);
  for (const i of newHistory) {
    await explorerHistoryStore.create(i);
  }
  return item.id;
}

export const saveToExplorerHistory = async (apiInput, apiResponse, apiLogs, designVariants, flowKey = 'unknown', bId = 'auto') => {
  try {
    if (!apiInput) {
      console.warn('Cannot save to explorer history: apiInput is null or undefined');
      return null;
    }

    const historyItem = buildExplorerHistoryItem(apiInput, apiResponse, apiLogs, designVariants, flowKey, bId, 'completed');
    return await persistExplorerHistoryItem(historyItem);
  } catch (error) {
    console.error('Failed to save to explorer history:', error);
    return null;
  }
};

export const savePendingToExplorerHistory = async (apiInput, flowKey = 'unknown', bId = 'auto', overrides = {}) => {
  try {
    if (!apiInput) {
      console.warn('Cannot save pending explorer history: apiInput is null or undefined');
      return null;
    }

    const historyItem = buildExplorerHistoryItem(apiInput, null, [], [], flowKey, bId, 'pending', {
      requestId: overrides.requestId || null,
      ...overrides,
    });
    return await persistExplorerHistoryItem(historyItem);
  } catch (error) {
    console.error('Failed to save pending explorer history:', error);
    return null;
  }
};

export const getExplorerHistory = async () => {
  try {
    return await explorerHistoryStore.getAll('desc');
  } catch (error) {
    console.error('Failed to get explorer history:', error);
    return [];
  }
};

export const getExplorerHistoryItem = async (id) => {
  try {
    return await explorerHistoryStore.get(id);
  } catch (error) {
    console.error('Failed to get explorer history item:', error);
    return null;
  }
};

export const updateExplorerHistoryItem = async (id, updates) => {
  try {
    return await explorerHistoryStore.update(id, updates);
  } catch (error) {
    console.error('Failed to update explorer history item:', error);
    return null;
  }
};

export const deleteExplorerHistoryItem = async (id) => {
  try {
    return await explorerHistoryStore.delete(id);
  } catch (error) {
    console.error('Failed to delete explorer history item:', error);
    return false;
  }
};

export const clearExplorerHistory = async () => {
  try {
    await explorerHistoryStore.deleteAll();
  } catch (error) {
    console.error('Failed to clear explorer history:', error);
  }
};

export const formatExplorerHistoryLabel = (item) => {
  const prompt = item.prompt && item.prompt !== 'No prompt'
    ? item.prompt
    : generatePromptFromInput(item.apiInput);

  if (item.name) {
    return item.name;
  }

  if (prompt) {
    const promptPreview = prompt.length > 35
      ? prompt.substring(0, 35) + '...'
      : prompt;
    return promptPreview;
  }

  return getFlowLabel(item.flowKey);
};
