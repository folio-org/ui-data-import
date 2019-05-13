/**
 * Description: TBD
 * @see documentation https://redux.js.org/api/compose
 *
 * @param {array} fns
 * @returns {*|(function(...[*]): *)}
 */
export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
