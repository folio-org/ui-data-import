import isPlainObject from 'lodash/isPlainObject';

/**
 * @typedef {Object} SortConfig
 * @property {string} property
 * @property {Array<string>} [sequence]
 * @property {boolean} [descending]
 */

/**
 * Generates SortConfig objects from string options or if SortConfig provided returns itself
 *
 * @param {Array<SortConfig | string>} iteratees
 *
 * @returns {Array<Object>}
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
 * @returns {number}
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
 * Sorts collections (arrays of objects)
 *
 * @param  {Array<Object>} collection An array of objects to sort
 * @param  {Array<SortConfig | string>} iteratees An array with sorting options
 *
 * @returns {Array<Object>} Sorted array
 */
const sortBy = (collection, iteratees) => {
  const collectionCopy = [...collection];
  const iterateesObjects = generateSortConfigs(iteratees);

  return collectionCopy.sort((a, b) => {
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
