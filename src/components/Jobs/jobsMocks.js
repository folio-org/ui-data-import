import {
  RUNNING,
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from './jobStatuses';

const constructHoursInMs = hours => hours * 60 * 60 * 1000;

// could be used to test jobs sorting in UIDATIMP-27
const jobMocks = [
  {
    jobProfileName: 'Authority updates',
    fileName: 'import7.marc',
    jobExecutionId: '112984498',
    jobExecutionHrId: '112984498',
    startedDate: new Date(new Date() - constructHoursInMs(1000.5)).toString(),
    status: READY_FOR_PREVIEW,
    runBy: {
      firstName: 'John',
      lastName: 'Doe',
    },
    progress: {
      current: 20000,
      total: 20000,
    },
    completedDate: new Date(new Date() - constructHoursInMs(999.3)).toString(),
  },
  {
    jobProfileName: 'Authority updates',
    fileName: 'import8.marc',
    jobExecutionId: '112974998',
    jobExecutionHrId: '112974998',
    startedDate: new Date(new Date() - constructHoursInMs(1000.3)).toString(),
    status: READY_FOR_PREVIEW,
    runBy: {
      firstName: 'John',
      lastName: 'Lennon',
    },
    progress: {
      current: 1000,
      total: 1000,
    },
    completedDate: new Date(new Date() - constructHoursInMs(1000.1)).toString(),
  },
  {
    jobProfileName: 'Marc bib jobs',
    fileName: 'import_156.mrc',
    jobExecutionId: '122984588',
    jobExecutionHrId: '122984588',
    startedDate: new Date(new Date() - constructHoursInMs(1.5)).toString(),
    status: RUNNING,
    runBy: {
      firstName: 'John',
      lastName: 'Doe',
    },
    progress: {
      current: 13500,
      total: 20000,
    },
    completedDate: '',
  },
  {
    jobProfileName: 'Marc jobs',
    fileName: 'import_209.mrc',
    jobExecutionId: '122984589',
    jobExecutionHrId: '122984589',
    startedDate: new Date(new Date() - constructHoursInMs(0.7)).toString(),
    status: RUNNING,
    runBy: {
      firstName: 'Indiana',
      lastName: 'Jones',
    },
    progress: {
      current: 2750,
      total: 9000,
    },
    completedDate: '',
  },
  {
    jobProfileName: 'Marc bib',
    fileName: 'import_159.mrc',
    jobExecutionId: '182984219',
    jobExecutionHrId: '182984219',
    startedDate: new Date(new Date() - constructHoursInMs(0.2)).toString(),
    status: RUNNING,
    runBy: {
      firstName: 'Mark',
      lastName: 'Anderson',
    },
    progress: {
      current: 350,
      total: 2000,
    },
    completedDate: '',
  },
  {
    jobProfileName: 'Library indexing',
    fileName: 'import_150.mrc',
    jobExecutionId: '182984532',
    jobExecutionHrId: '182984532',
    startedDate: new Date(new Date() - constructHoursInMs(0.4)).toString(),
    status: PREPARING_FOR_PREVIEW,
    runBy: {
      firstName: 'Jack',
      lastName: 'Doe',
    },
    progress: {
      current: 1750,
      total: 2000,
    },
    completedDate: '',
  },
  {
    jobProfileName: 'Library indexing',
    fileName: 'import_102.mrc',
    jobExecutionId: '182982989',
    jobExecutionHrId: '182982989',
    startedDate: new Date(new Date() - constructHoursInMs(0.1)).toString(),
    status: PREPARING_FOR_PREVIEW,
    runBy: {
      firstName: 'Marie',
      lastName: 'Curie',
    },
    progress: {
      current: 90,
      total: 2000,
    },
    completedDate: '',
  },
];

export default jobMocks;
