/**
 * @param {string | Element} selector
 * @param {string | Element} [container]
 *
 * @return {HTMLElement | null}
 */
export const getElement = (selector, container) => {
  if (selector instanceof Element) {
    return selector;
  }

  try {
    const containerElem = container ? getElement(container) : document.body;

    return containerElem.querySelector(selector);
  } catch (error) {
    return null;
  }
};
