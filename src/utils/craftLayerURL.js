/**
 * Description: TBD
 *
 * @param {object} location comes from withRouter
 * @param {string} type layer type
 * @return {string} URL created
 */
export const createLayerURL = (location, type) => {
  const {
    pathname,
    search,
  } = location;

  const url = `${pathname}${search}`;

  return `${url}${url.includes('?') ? '&' : '?'}layer=${type}`;
};
