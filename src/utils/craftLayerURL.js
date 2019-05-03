/**
 * @param {object} location comes from withRouter
 * @param {string} type layer type
 */
export const createLayerURL = (location, type) => {
  const {
    pathname,
    search,
  } = location;

  const url = `${pathname}${search}`;

  return `${url}${url.includes('?') ? '&' : '?'}layer=${type}`;
};
