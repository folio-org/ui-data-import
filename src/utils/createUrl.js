import { map } from 'lodash';

const generateQueryParams = (params = {}) => {
  const queryParamsString = map(params, (value, key) => [key, value].map(encodeURIComponent).join('='))
    .join('&');

  return `${(queryParamsString.length ? '?' : '')}${queryParamsString}`;
};

/**
 * Creates url with query parameters
 *
 * @param  {string} url
 * @param  {object} [queryParams]
 */
export const createUrl = (url, queryParams = {}) => {
  if (typeof url !== 'string') {
    throw new Error('First parameter must be of type string');
  }

  const paramsString = generateQueryParams(queryParams);

  return `${url.endsWith('?') ? url.slice(0, -1) : url}${paramsString}`;
};
