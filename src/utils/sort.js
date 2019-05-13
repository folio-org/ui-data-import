/**
 * Sorts 2 strings
 * Works as a sorter callback in sort() function
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
 * Works as a sorter callback in sort() function
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
 * Works as a sorter callback in sort() function
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function sortNums(a, b) {
  return a - b;
}
