/**
 * Sorts 2 strings.
 * Works as a sorter callback in sort() function.
 *
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
export function sortStrings(a, b) {
  const valA = a.toUpperCase();
  const valB = b.toUpperCase();

  if (valA < valB) {
    return -1;
  }

  if (valA > valB) {
    return 1;
  }

  return 0;
}

/**
 * Sorts 2 dates.
 * Works as a sorter callback in sort() function.
 *
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
export function sortDates(a, b) {
  const valA = new Date(a);
  const valB = new Date(b);

  return valA - valB;
}

/**
 * Sorts 2 numbers.
 * Works as a sorter callback in sort() function.
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function sortNums(a, b) {
  return a - b;
}

/**
 * Builds Stripes lists sort order queries
 *
 * @param {string} oldOrder
 * @param {string} newOrder
 * @param {string} defaultSort
 * @param {number} maxSortKeys
 * @returns {string}
 */
export function buildSortOrder(oldOrder, newOrder, defaultSort, maxSortKeys) {
  const initialOrder = oldOrder || defaultSort;
  const orders = initialOrder ? initialOrder.split(',') : [];
  const mainSort = orders[0];
  const isSameColumn = mainSort && newOrder === mainSort.replace(/^-/, '');

  if (isSameColumn) {
    orders[0] = `-${mainSort}`.replace(/^--/, '');
  } else {
    orders.unshift(newOrder);
  }

  return orders.slice(0, maxSortKeys).join(',');
}
