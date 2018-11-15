// documentation https://redux.js.org/api/compose
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

export default compose;
