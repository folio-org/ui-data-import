const generateQueryParams = (params = {}) => Object.entries(params)
  .map(param => param.map(encodeURIComponent).join('='))
  .join('&');

/**
 * Creates url with query parameters
 *
 * @param  {string} url
 * @param  {object} [params]
 */
const createUrl = (url, params = {}) => {
  if (typeof url !== 'string') {
    throw new Error('First parameter must be of type string');
  }

  const paramsString = generateQueryParams(params);

  return `${url.endsWith('?') ? url.slice(0, -1) : url}?${paramsString}`;
};

export default createUrl;
