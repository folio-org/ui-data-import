import {
  camelCase,
  get,
  isEmpty,
  last,
} from 'lodash';

/**
 * Gets prohibited siblings for the last profile in a tree.
 *
 * @param {Array} profiles
 * @param {Object} siblingsProhibited
 * @returns {Array} Returns array of prohibited profile entities.
 */
export const getDisabledOptions = (profiles, siblingsProhibited) => {
  if (!isEmpty(profiles)) {
    const lastProfile = last(profiles);
    const lastEntityKey = `${camelCase(lastProfile.contentType)}s`;

    return get(siblingsProhibited, lastEntityKey, []);
  }

  return [];
};
