const constructHoursInMs = hours => {
  return hours * 60 * 60 * 1000;
};

export default {
  preview: [
    {
      jobProfileName: 'Shelfready records',
      fileName: 'import6.mrc',
      jobExecutionHRID: '182984472',
      completedDate: '2018-10-25T14:49:34.000+0000',
      status: 'READY_FOR_PREVIEW',
      runBy: {
        firstName: 'John',
        lastName: 'Doe',
      },
      progress: {
        current: 0,
        total: 500,
      },
    },
    {
      jobProfileName: 'Marc bib jobs',
      fileName: 'import_4.csv',
      jobExecutionHRID: '182984470',
      startedDate: new Date(new Date() - constructHoursInMs(0.3)),
      status: 'PREPARING_FOR_PREVIEW',
      runBy: {
        firstName: 'Wayne',
        lastName: 'Rooney',
      },
      progress: {
        current: 5000,
        total: 100000,
      },
    },
  ],
  running: [
    {
      jobProfileName: 'Authority updates',
      fileName: 'import7.marc',
      jobExecutionHRID: '182984498',
      startedDate: new Date(new Date() - constructHoursInMs(0.1)),
      status: 'RUNNING',
      runBy: {
        firstName: 'John',
        lastName: 'Doe',
      },
      progress: {
        current: 15000,
        total: 20000,
      },
    },
    {
      jobProfileName: 'Marc bib jobs',
      fileName: 'importimportimport_156.mrc',
      jobExecutionHRID: '182984589',
      startedDate: new Date(new Date() - constructHoursInMs(0.2)),
      status: 'RUNNING',
      runBy: {
        firstName: 'John',
        lastName: 'Doe',
      },
      progress: {
        current: 1750,
        total: 2000,
      },
    },
    {
      jobProfileName: 'Marc bib jobs',
      fileName: 'import_23.csv',
      jobExecutionHRID: '182984489',
      startedDate: new Date(new Date() - constructHoursInMs(0.2)),
      status: 'RUNNING',
      runBy: {
        firstName: 'Wayne',
        lastName: 'Rooney',
      },
      progress: {
        current: 100,
        total: 300,
      },
    },
  ],
};
