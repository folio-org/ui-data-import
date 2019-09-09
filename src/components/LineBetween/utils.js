/** @param {string | Element} selector */
export const getElement = selector => {
  if (selector instanceof Element) {
    return selector;
  }

  try {
    return document.querySelector(selector);
  } catch (error) {
    return null;
  }
};
