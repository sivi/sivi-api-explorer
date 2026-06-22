import config from '../config/index.js';

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'sivi-api-key': config.siviApiKey,
};

class SiviApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Centralized Sivi API HTTP client.
 * Handles authentication headers, JSON serialization, and basic error handling.
 */
const siviClient = {
  /**
   * Perform a GET request to the Sivi API.
   * @param {string} endpoint - API endpoint path (e.g., '/general/get-design-variants')
   * @param {Object} queryParams - Query parameters object
   * @returns {Promise<any>} Parsed JSON response
   */
  async get(endpoint, queryParams = {}, extraHeaders = {}) {
    const url = new URL(`${config.siviApiUrl}${endpoint}`);
    if (Object.keys(queryParams).length > 0) {
      url.searchParams.append('queryParams', JSON.stringify(queryParams));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { ...BASE_HEADERS, ...extraHeaders },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new SiviApiError(
        `Sivi API GET ${endpoint} failed with status ${response.status}: ${errorBody}`,
        response.status
      );
    }

    return response.json();
  },

  /**
   * Perform a POST request to the Sivi API.
   * @param {string} endpoint - API endpoint path
   * @param {Object} body - Request body
   * @returns {Promise<any>} Parsed JSON response
   */
  async post(endpoint, body = {}, extraHeaders = {}) {
    const response = await fetch(`${config.siviApiUrl}${endpoint}`, {
      method: 'POST',
      headers: { ...BASE_HEADERS, ...extraHeaders },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new SiviApiError(
        `Sivi API POST ${endpoint} failed with status ${response.status}: ${errorBody}`,
        response.status
      );
    }

    return response.json();
  },
};

export { SiviApiError };
export default siviClient;
