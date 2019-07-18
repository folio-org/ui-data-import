export const associatedActionProfiles = {
  contentType: 'MAPPING_PROFILE',
  childSnapshotWrappers: [
    {
      id: 'ba8d822f-97db-4794-8393-562a0b2cf755',
      contentType: 'ACTION_PROFILE',
      content: {
        id: 'ba8d822f-97db-4794-8393-562a0b2cf755',
        name: 'Create authority MARC',
        description: '',
        tags: { tagList: ['authorities'] },
        reactTo: 'NON-MATCH',
        action: 'CREATE',
        folioRecord: 'MARC_AUTHORITY',
        deleted: false,
        userInfo: {
          firstName: 'DIKU',
          lastName: 'ADMINISTRATOR',
          userName: 'diku_admin',
        },
        metadata: {
          createdDate: '2018-10-30T12:45:33.000+0000',
          createdByUserId: '',
          createdByUsername: '',
          updatedDate: '2018-11-03T11:22:30.000+0000',
          updatedByUserId: '',
          updatedByUsername: '',
        },
      },
      childSnapshotWrappers: [],
    },
    {
      id: '8eeabfcc-4c11-4ec7-b273-9c04dc0013bb',
      contentType: 'ACTION_PROFILE',
      content: {
        id: '8eeabfcc-4c11-4ec7-b273-9c04dc0013bb',
        name: 'Replace authority MARC',
        description: '',
        tags: { tagList: ['authorities'] },
        reactTo: 'MATCH',
        action: 'REPLACE',
        folioRecord: 'MARC_AUTHORITY',
        deleted: false,
        userInfo: {
          firstName: 'DIKU',
          lastName: 'ADMINISTRATOR',
          userName: 'diku_admin',
        },
        metadata: {
          createdDate: '2018-10-30T12:42:18.000+0000',
          createdByUserId: '',
          createdByUsername: '',
          updatedDate: '2018-11-03T10:01:30.000+0000',
          updatedByUserId: '',
          updatedByUsername: '',
        },
      },
      childSnapshotWrappers: [],
    },
  ],
};

export const noAssociatedActionProfiles = {
  contentType: 'MAPPING_PROFILE',
  childSnapshotWrappers: [],
};
