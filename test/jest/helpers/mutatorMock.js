export const buildMutator = (otherMutators = {}) => ({
  resultCount: { replace: () => {} },
  resultOffset: { replace: () => {} },
  ...otherMutators,
});
