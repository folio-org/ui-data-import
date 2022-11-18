import { LAYER_TYPES } from './constants';

/**
 * Description: TBD
 *
 * @param {object} baseUrl base location url
 * @param {string} layerType layer type
 * @param {string} seach search query
 * @param {string} recordId id of the record
 * @return {string} URL created
 */
export const createLayerURL = ({
  baseUrl,
  layerType,
  search,
  recordId = '',
}) => {
  const basicPath = `${baseUrl}/${layerType}`;

  return layerType === LAYER_TYPES.CREATE ? `${basicPath}${search}` : `${basicPath}/${recordId}${search}`;
};
