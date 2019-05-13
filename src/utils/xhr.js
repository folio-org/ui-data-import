import {
  get,
  forEach,
} from 'lodash';

/**
 * Composes XHR headers set
 *
 * @param {Object|XMLHttpRequest} xhr
 * @param {array} headers
 */
export const xhrAddHeaders = (xhr, headers) => {
  forEach(headers, (value, key) => {
    xhr.setRequestHeader(key, value);
  });
};

/**
 * Gets formats and returns XMLHTTPRequest responses
 *
 * @param {*} response
 * @return {*}
 */
export const getXHRResponse = response => {
  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.startsWith('application/json')) {
    return response.json();
  }

  return response;
};

/**
 * Gets formats and returns XMLHTTPRequest errors
 *
 * @param {*} response
 * @return {Promise<null|*>}
 */
export const getXHRErrorMessage = async response => {
  try {
    const json = await getXHRResponse(response);

    return get(json, 'errors.0.message');
  } catch (error) {
    return null;
  }
};
