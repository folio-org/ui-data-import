export const associatedJobProfiles = {
  contentType: 'MATCH_PROFILE',
  childSnapshotWrappers: [
    {
      contentType: 'JOB_PROFILE',
      content: {
        id: '448ae575-daec-49c1-8041-d64c8ed8e5b1',
        name: 'Load vendor order records',
        description: 'Ordered on vendor site; load MARC to create bib, holdings, item, and order; keep MARC',
        dataType: 'MARC',
        tags: { tagList: ['acq', 'daily'] },
        userInfo: {
          firstName: 'DIKU',
          lastName: 'ADMINISTRATOR',
          userName: 'diku_admin',
        },
        metadata: {
          createdDate: '2018-10-30T12:41:22.000+0000',
          createdByUserId: '',
          createdByUsername: 'diku_admin',
          updatedDate: '2018-11-02T12:09:51.000+0000',
          updatedByUserId: '',
          updatedByUsername: 'diku_admin',
        },
      },
    },
    {
      contentType: 'JOB_PROFILE',
      content: {
        id: 'h4bcv28f-daec-22c1-9341-sbh22sk5b45hsh',
        name: 'Bib record',
        description: 'Uploading records data',
        dataType: 'MARC',
        tags: { tagList: [] },
        userInfo: {
          firstName: 'DIKU',
          lastName: 'ADMINISTRATOR',
          userName: 'diku_admin',
        },
        metadata: {
          createdDate: '2018-10-30T12:41:22.000+0000',
          createdByUserId: '',
          createdByUsername: 'diku_admin',
          updatedDate: '2018-11-02T12:09:51.000+0000',
          updatedByUserId: '',
          updatedByUsername: 'diku_admin',
        },
      },
    },
    {
      contentType: 'JOB_PROFILE',
      content: {
        id: '33nfkdjf-daec-44r3-1141-d64c8ed7dchs8c',
        name: 'Initial parsing',
        description: '',
        dataType: 'MARC',
        tags: { tagList: ['upload'] },
        userInfo: {
          firstName: 'DIKU',
          lastName: 'ADMINISTRATOR',
          userName: 'diku_admin',
        },
        metadata: {
          createdDate: '2018-10-30T12:41:22.000+0000',
          createdByUserId: '',
          createdByUsername: 'diku_admin',
          updatedDate: '2018-11-02T12:09:51.000+0000',
          updatedByUserId: '',
          updatedByUsername: 'diku_admin',
        },
      },
    },
  ],
};
