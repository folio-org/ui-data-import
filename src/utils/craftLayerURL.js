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
  const pathList = pathname.split('/');

  if (type === LAYER_TYPES.CREATE) {
    pathList.length = 4;
    pathList.push(type);
  } else {
    const itemToChangeIndex = pathList.findIndex(item => item === LAYER_TYPES.VIEW);
    pathList[itemToChangeIndex] = type;
  }

  return `${pathList.join('/')}${search}`;
};
