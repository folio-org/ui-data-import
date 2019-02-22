import {
  get,
  forEach,
} from 'lodash';

export const xhrAddHeaders = (xhr, headers) => {
  forEach(headers, (value, key) => {
    xhr.setRequestHeader(key, value);
  });
};

export const getXHRResponse = response => {
  const contentType = response.headers.get('Content-Type') || '';

  if (!contentType.startsWith('application/json')) {
    return response;
  }

  return response.json();
};

export const getXHRErrorMessage = async response => {
  try {
    const json = await getXHRResponse(response);

    return get(json, 'errors.0.message');
  } catch (e) {
    return null;
  }
};
