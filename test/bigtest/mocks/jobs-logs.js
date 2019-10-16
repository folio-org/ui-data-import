const jobsLogsData = [
  {
    id: '67dfac11-1caf-4470-9ad1-d533f6360bdd',
    hrId: '02',
    jobProfileInfo: { name: 'Multilingual support check' },
    fileName: 'import_28.mrc',
    progress: {
      jobExecutionId: '3d790a2a-86de-46f9-a9ae-c9109bba746b',
      total: 9,
    },
    runBy: {
      firstName: 'Ozzy',
      lastName: 'Campenshtorm',
    },
    completedDate: '2018-11-11T14:10:34.000+0000',
    status: 'ERROR',
    uiStatus: 'ERROR',
  },
  {
    id: '2e149aef-bb77-45aa-8a28-e139674b55e1',
    hrId: '03',
    jobProfileInfo: { name: 'Standard BIB profile' },
    fileName: 'import_22.mrc',
    progress: {
      jobExecutionId: '2e149aef-bb77-45aa-8a28-e139674b55e1',
      total: 7,
    },
    runBy: {
      firstName: 'Elliot',
      lastName: 'Lane',
    },
    completedDate: '2018-11-05T14:21:57.000+0000',
    status: 'COMMITTED',
    uiStatus: 'RUNNING_COMPLETE',
  },
  {
    id: '4aa3f7f9-3fe5-4a29-a149-72f7b08879da',
    hrId: '01',
    jobProfileInfo: { name: 'BIB profile with customized Holdings' },
    fileName: 'import_22.mrc',
    progress: {
      jobExecutionId: '2e149aef-bb77-45aa-8a28-e139674b55e1',
      total: 46,
    },
    runBy: {
      firstName: 'Jay',
      lastName: 'Morrowitz',
    },
    completedDate: '2018-11-05T13:08:12.000+0000',
    status: 'COMMITTED',
    uiStatus: 'RUNNING_COMPLETE',
  },
];

export const jobsLogs = [...jobsLogsData];
