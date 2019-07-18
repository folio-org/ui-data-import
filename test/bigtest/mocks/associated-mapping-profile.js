export const associatedMappingProfile = {
  contentType: 'ACTION_PROFILE',
  childSnapshotWrappers: [{
    id: '4a887936-794d-4014-a1ec-046abfab01f6',
    contentType: 'MAPPING_PROFILE',
    content: {
      id: '4a887936-794d-4014-a1ec-046abfab01f6',
      name: 'AP Instance',
      description: 'Use for PurpleVendor approval plan MARC files',
      tags: { tagList: ['approvals', 'purple-vendor'] },
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      folioRecord: 'INSTANCE',
      deleted: false,
      userInfo: {
        firstName: 'DIKU',
        lastName: 'ADMINISTRATOR',
        userName: 'diku_admin',
      },
      metadata: {
        createdDate: '2018-11-03T11:22:30.000+0000',
        createdByUserId: '',
        createdByUsername: '',
        updatedDate: '2018-11-04T11:22:30.000+0000',
        updatedByUserId: '',
        updatedByUsername: '',
      },
    },
    childSnapshotWrappers: [],
  }],
};

export const noAssociatedMappingProfile = {
  contentType: 'ACTION_PROFILE',
  childSnapshotWrappers: [],
};
