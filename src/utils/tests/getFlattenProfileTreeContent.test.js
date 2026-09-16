import { getFlattenProfileTreeContent } from '../getFlattenProfileTreeContent';

describe('getFlattenProfileTreeContent function', () => {
  it('should return an empty array for an empty input', () => {
    expect(getFlattenProfileTreeContent([])).toEqual([]);
  });

  it('should return items as-is for a flat list without children', () => {
    const tree = [
      { id: 'item-1', childSnapshotWrappers: [] },
      { id: 'item-2', childSnapshotWrappers: [] },
    ];

    expect(getFlattenProfileTreeContent(tree)).toEqual(tree);
  });

  it('should flatten nested children in parent-first order', () => {
    const child1 = { id: 'child-1', childSnapshotWrappers: [] };
    const grandChild = { id: 'grand-child-1', childSnapshotWrappers: [] };
    const child2 = { id: 'child-2', childSnapshotWrappers: [grandChild] };
    const parent1 = { id: 'parent-1', childSnapshotWrappers: [child1, child2] };
    const parent2 = { id: 'parent-2', childSnapshotWrappers: [] };
    const tree = [parent1, parent2];

    expect(getFlattenProfileTreeContent(tree)).toEqual([
      parent1,
      child1,
      child2,
      grandChild,
      parent2,
    ]);
  });
});
