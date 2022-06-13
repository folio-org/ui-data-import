/**
 * Gets an item with the given key from sessionStorage
 * @param {string} key
 * @returns {any}
 */
function getItem(key) {
  try {
    return JSON.parse(window.sessionStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

/**
 * Adds an item the given key to sessionStorage
 * @param {string} key
 * @param {any} value
 * @returns {void}
 */
function setItem(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Could not save the item to the storage');
  }
}

export const storage = {
  getItem,
  setItem,
};
