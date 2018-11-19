import { isPlainObject } from 'lodash';

/**
 * @typedef {Object} SortConfig
 * @property {string} property
 * @property {Array<string>} [sequence]
 * @property {boolean} [descending]
 */

/**
 * @typedef {Array<Object>} Collection
 */

/**
 * Generates SortConfig objects from string options or if SortConfig provided returns itself
 *
 * @param {Array<SortConfig | string>} iteratees
 *
 * @returns {Collection}
 */
const generateSortConfigs = iteratees => iteratees
  .map(iterateeObject => {
    // strings must be transformed in config objects
    if (typeof iterateeObject === 'string') {
      let descending = false;
      let property = iterateeObject;

      // if string starts with "-" than sorting should be descending
      if (property[0] === '-') {
        descending = true;
        property = iterateeObject.substr(1);
      }

      return {
        property,
        descending,
      };
    }

    if (isPlainObject(iterateeObject)) {
      return iterateeObject;
    }

    throw new TypeError(`${JSON.stringify(iterateeObject)} is not valid value.`);
  });

/**
 * Compares a and b and returns 1, -1 or 0
 *
 * @param  {SortConfig} sortOption
 * @param  {Object} a
 * @param  {Object} b
 *
 * @returns {number} 1, -1 or 0
 */
const configurableSort = ({ property, sequence, descending }, a, b) => {
  // 1 - ascending, -1 - descending
  const sortOrder = descending ? -1 : 1;
  let propA = a[property];
  let propB = b[property];
  let result = 0;

  // if order is sequence array than indexes are checked instead of alphabetical order
  if (Array.isArray(sequence)) {
    // get index from sequence array
    propA = sequence.findIndex(el => el === propA);
    propB = sequence.findIndex(el => el === propB);
    // if there is no such element in sequence array element must be in the end of the sorted array
    propA = propA === -1 ? Infinity : propA;
    propB = propB === -1 ? Infinity : propB;
  }

  if (propA > propB) {
    result = 1;
  }
  if (propA < propB) {
    result = -1;
  }

  // changes sign depending on sort order
  result *= sortOrder;

  return result;
};

/**
 * Sorts collections by parameters specified in configs.
 * Second argument accepts an array with SortConfig objects and/or field names.
 * SortConfig object example:
 * {
 *   property: 'propName',
 *   descending: true
 * }
 * The sort config example above could be changed with '-propName' string
 * where '-' in the beginning means descending order.
 * However SortConfig with sequence property must be passed as object.
 * SortConfig with sequence example:
 * {
 *   property: 'status',
 *   sequence: ['RUNNING', 'FAILED']
 * }
 *
 * @param  {Collection} [collection = []] A collection to sort
 * @param  {Array<SortConfig | string>} [iteratees = []] An array with sorting options
 *
 * @returns {Collection} Sorted collection
 */
const sortBy = (collection = [], iteratees = []) => {
  const iterateesObjects = generateSortConfigs(iteratees);

  return [...collection].sort((a, b) => {
    let i = 0;
    let result = 0;

    while (result === 0 && i < iterateesObjects.length) {
      result = configurableSort(iterateesObjects[i], a, b);
      i++;
    }

    return result;
  });
};

export default sortBy;
