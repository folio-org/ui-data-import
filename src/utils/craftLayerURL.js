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

  if (type === LAYER_TYPES.CREATE) {
    return `${pathname}/${type}${search}`;
  }

  const splittedArr = pathname.split('/');
  const itemToChangeIndex = splittedArr.findIndex(item => item === LAYER_TYPES.VIEW);
  splittedArr[itemToChangeIndex] = type;
  const joinedArr = splittedArr.join('/');

  const url = `${joinedArr}${search}`;

  return url;
};
