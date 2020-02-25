import { snapshotWrappers } from '../../mocks';

export default server => {
  server.create('profile-snapshot', {
    profileId: '828a787c-bcf3-4c28-891a-9e6f3ba5068b',
    childSnapshotWrappers: snapshotWrappers.find(wrapper => wrapper.id === '828a787c-bcf3-4c28-891a-9e6f3ba5068b').childSnapshotWrappers,
    content: {
      id: '828a787c-bcf3-4c28-891a-9e6f3ba5068b',
      name: 'Load MARC, then throw away',
    },
  });
  server.create('profile-snapshot', {
    profileId: '448ae575-daec-49c1-8041-d64c8ed8e5b1',
    childSnapshotWrappers: snapshotWrappers.find(wrapper => wrapper.id === '448ae575-daec-49c1-8041-d64c8ed8e5b1').childSnapshotWrappers,
    content: {
      id: '448ae575-daec-49c1-8041-d64c8ed8e5b1',
      name: 'Load vendor order records',
    },
  });

  server.get('/data-import-profiles/profileSnapshots/:id', (schema, request) => {
    const { params: { id } } = request;
    const profileSnapshotModels = schema.profileSnapshots.where(snapshot => snapshot.profileId === id);

    return profileSnapshotModels?.models[0]?.attrs;
  });
};
