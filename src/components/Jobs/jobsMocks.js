import { RUNNING } from './jobStatuses';

const constructHoursInMs = hours => {
  return hours * 60 * 60 * 1000;
};

export default {
  running: [
    {
      jobProfileName: 'Authority updates',
      fileName: 'import7.marc',
      jobExecutionId: '182984498',
      jobExecutionHrId: '182984498',
      startedDate: new Date(new Date() - constructHoursInMs(0.1)),
      status: RUNNING,
      runBy: {
        firstName: 'John',
        lastName: 'Doe',
      },
      progress: {
        current: 15000,
        total: 20000,
      },
      completedDate: '',
    },
    {
      jobProfileName: 'Marc bib jobs',
      fileName: 'import_156.mrc',
      jobExecutionId: '182984589',
      jobExecutionHrId: '182984589',
      startedDate: new Date(new Date() - constructHoursInMs(0.2)),
      status: RUNNING,
      runBy: {
        firstName: 'John',
        lastName: 'Doe',
      },
      progress: {
        current: 1750,
        total: 2000,
      },
      completedDate: '',
    },
  ],
};
