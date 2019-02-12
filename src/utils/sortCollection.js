import {
  isPlainObject,
  isFunction,
} from 'lodash';

/**
 * @typedef {Object} SortConfig
 * @property {string} [propertyName]
 * @property {Function} [compareFunction]
 * @property {Array<string>} [sequence]
 * @property {boolean} [descending]
 */

/**
 * @typedef {Array<Object>} Collection
 */

/**
 * Generates SortConfig objects from string options or returns provided SortConfig as is
 *
 * @param {Array<SortConfig | string | Function>} iteratees
 *
 * @returns {Collection}
 */
const generateSortConfigs = iteratees => iteratees
  .map(iteratee => {
    // strings must be transformed in config objects
    if (typeof iteratee === 'string') {
      let descending = false;
      let propertyName = iteratee;

      // if string starts with "-" than sorting should be descending
      if (propertyName[0] === '-') {
        descending = true;
        propertyName = iteratee.substr(1);
      }

      return {
        propertyName,
        descending,
      };
    }

    if (isFunction(iteratee)) {
      return {
        compareFunction: iteratee,
      };
    }

    if (isPlainObject(iteratee)) {
      return iteratee;
    }

    throw new TypeError(`${JSON.stringify(iteratee)} is not valid value`);
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
const configurableSort = ({
  compareFunction,
  propertyName,
  sequence,
  descending,
}, a, b) => {
  if (compareFunction) {
    return compareFunction(a, b);
  }

  if (!Object.prototype.hasOwnProperty.call(a, propertyName) ||
    !Object.prototype.hasOwnProperty.call(b, propertyName)) {
    throw new Error(`${propertyName} does not exist`);
  }

  // 1 - ascending, -1 - descending
  const sortOrder = descending ? -1 : 1;
  let propA = a[propertyName];
  let propB = b[propertyName];
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
 * Second argument accepts an array with SortConfig objects and/or field names and/or compare functions.
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
 * Compare function takes two adjacent elements and must return a number determining sort order.
 * Compare function example:
 * (a, b) => b.propName - a.propName;
 *
 * @param  {Collection} [collection = []] A collection to sort
 * @param  {Array<SortConfig | string | Function>} [iteratees = []] An array with sorting options
 *
 * @returns {Collection} Sorted collection
 */
export const sortCollection = (collection = [], iteratees = []) => {
  if (!Array.isArray(collection)) {
    throw new TypeError('collection parameter must be an array');
  }

  const iterateesObjects = generateSortConfigs(iteratees);
  const { length } = iterateesObjects;

  return [...collection].sort((a, b) => {
    let i = 0;
    let result = 0;

    while (result === 0 && i < length) {
      const { [i]: sortOption } = iterateesObjects;

      result = configurableSort(sortOption, a, b);
      i++;
    }

    return result;
  });
};
