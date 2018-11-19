import { RUNNING } from './jobStatuses';

const constructHoursInMs = hours => {
  return hours * 60 * 60 * 1000;
};

// could be used to test jobs sorting in UIDATIMP-27
export default [
  {
    jobProfileName: 'Authority updates',
    fileName: 'import7.marc',
    jobExecutionId: '112984498',
    jobExecutionHrId: '182989498',
    startedDate: new Date(new Date() - constructHoursInMs(0.1)).toString(),
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
    jobExecutionId: '122984589',
    jobExecutionHrId: '262984589',
    startedDate: new Date(new Date() - constructHoursInMs(100.5)).toString(),
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
  {
    jobProfileName: 'Marc bib jobs',
    fileName: 'import_156.mrc',
    jobExecutionId: '122984589',
    jobExecutionHrId: '222984589',
    startedDate: new Date(new Date() - constructHoursInMs(1000.5)).toString(),
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
  {
    jobProfileName: 'Marc bib jobs',
    fileName: 'import_156.mrc',
    jobExecutionId: '182984219',
    jobExecutionHrId: '182984211',
    startedDate: new Date(new Date() - constructHoursInMs(2.2)).toString(),
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
  {
    jobProfileName: 'Marc bib jobs',
    fileName: 'import_156.mrc',
    jobExecutionId: '182984532',
    jobExecutionHrId: '182454589',
    startedDate: new Date(new Date() - constructHoursInMs(0.4)).toString(),
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
  {
    jobProfileName: 'Marc bib jobs',
    fileName: 'import_156.mrc',
    jobExecutionId: '182982989',
    jobExecutionHrId: '182124589',
    startedDate: new Date(new Date() - constructHoursInMs(0.1)).toString(),
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
];
