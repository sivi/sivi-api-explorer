import { historyStore } from '../storage/IndexedDBStore.js';
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
  const flowLabel = getFlowLabel(item.flowKey);
  const prompt = item.prompt && item.prompt !== 'No prompt'
    ? item.prompt
    : generatePromptFromInput(item.apiInput);

  if (item.name) {
    return `${flowLabel}: ${item.name}`;
  }

  if (prompt) {
    const promptPreview = prompt.length > 35
      ? prompt.substring(0, 35) + '...'
      : prompt;
    return `${flowLabel}: ${promptPreview}`;
  }

  return flowLabel;
};
