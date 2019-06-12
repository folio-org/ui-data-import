import {
  get,
  forEach,
} from 'lodash';

/**
 * Composes XMLHttpRequest headers set
 *
 * @param {XMLHttpRequest} xhr
 * @param {{ [key: string]: string }} headers
 */
export const xhrAddHeaders = (xhr, headers) => {
  forEach(headers, (value, key) => {
    xhr.setRequestHeader(key, value);
  });
};

/**
 * Gets formats and returns XMLHttpRequest responses
 *
 * @param {Response} response
 */
export const getXHRResponse = async response => {
  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.startsWith('application/json')) {
    return response.json();
  }

  return response;
};

/**
 * Gets formats and returns XMLHttpRequest errors
 *
 * @param {Response} response
 * @return {Promise<string | null>}
 */
export const getXHRErrorMessage = async response => {
  try {
    const json = await getXHRResponse(response);

    return get(json, 'errors.0.message', null);
  } catch (error) {
    return null;
  }
};
