import { JOB_STATUSES } from '../../../src/utils';

const { RUNNING } = JOB_STATUSES;

const runningJobs = [
  {
    id: '469eba83-41d1-4161-bd1a-0f46d5554c6a',
    hrId: 182982989,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Main bib jobs' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Mark',
      lastName: 'Curie',
    },
    progress: {
      current: 290,
      total: 500,
    },
    startedDate: '2018-11-22T12:00:31.000',
    uiStatus: RUNNING,
    status: 'PROCESSING_FINISHED',
  },
  {
    id: '469eba83-41d1-4161-bd1a-0f46d555499u',
    hrId: 182983328,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Main bib indexing' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Mark',
      lastName: 'Doe',
    },
    progress: {
      current: 480,
      total: 900,
    },
    startedDate: '2018-11-23T16:40:31.000',
    uiStatus: RUNNING,
    status: 'PROCESSING_FINISHED',
  },
  {
    id: '469eba83-41d1-4161-bd1a-0f46d555112p',
    hrId: 182983990,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Authority updates' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Mark',
      lastName: 'Jones',
    },
    progress: {
      current: 1790,
      total: 2400,
    },
    startedDate: '2018-11-23T17:50:31.000',
    uiStatus: RUNNING,
    status: 'PROCESSING_FINISHED',
  },
];

export const jobExecutions = [...runningJobs];

export const RUNNING_JOBS_LENGTH = runningJobs.length;
