// documentation https://redux.js.org/api/compose
export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
