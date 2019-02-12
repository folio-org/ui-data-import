const jobsLogsData = [
  {
    jobExecutionId: '3d790a2a-86de-46f9-a9ae-c9109bba746b',
    jobExecutionHrId: '23391',
    jobProfileName: 'Multilingual support check',
    fileName: 'import_28.mrc',
    runBy: {
      firstName: 'Ozzy',
      lastName: 'Campenshtorm',
    },
    completedDate: '2018-11-11T14:10:34.000+0000',
    status: 'ERROR',
    uiStatus: 'ERROR',
  },
  {
    jobExecutionId: '2e149aef-bb77-45aa-8a28-e139674b55e1',
    jobExecutionHrId: '20091',
    jobProfileName: 'Standard BIB profile',
    fileName: 'import_22.mrc',
    runBy: {
      firstName: 'Elliot',
      lastName: 'Lane',
    },
    completedDate: '2018-11-05T14:21:57.000+0000',
    status: 'COMMITTED',
    uiStatus: 'RUNNING_COMPLETE',
  },
  {
    jobExecutionId: '4aa3f7f9-3fe5-4a29-a149-72f7b08879da',
    jobExecutionHrId: '18591',
    jobProfileName: 'BIB profile with customized Holdings',
    fileName: 'import_20.mrc',
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
