export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function request(method, path, body = null) {
  const url = `${API_BASE}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      data.error || `HTTP ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

export const apiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
};

export { ApiError };
