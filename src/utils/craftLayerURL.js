import { LAYER_TYPES } from './constants';

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
  const splittedPath = pathname.split('/');

  if (type === LAYER_TYPES.CREATE) {
    splittedPath.length = 4;
    splittedPath.push(type);
  } else {
    const itemToChangeIndex = splittedPath.findIndex(item => item === LAYER_TYPES.VIEW);
    splittedPath[itemToChangeIndex] = type;
  }

  const url = `${splittedPath.join('/')}${search}`;

  return url;
};
