/**
 * Build proper url string from received parameters.
 *
 * @param {string} url
 * @param {Array} queryParams
 * @returns {string}
 */
export const createUrlFromArray = (url, queryParams = []) => {
  const paramsString = queryParams.join('&');

  return `${url.endsWith('?') ? url.slice(0, -1) : url}?${paramsString}`;
};
