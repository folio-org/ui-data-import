export const getFlattenProfileTreeContent = function buildData(array) {
  return array.reduce((acc, item) => {
    if (item.childSnapshotWrappers.length) {
      const children = buildData(item.childSnapshotWrappers);

      return [...acc, item, ...children];
    }

    return [...acc, item];
  }, []);
};
