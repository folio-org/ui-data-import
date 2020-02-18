import { JOB_STATUSES } from '../../../src/utils/constants';

const {
  PREPARING_FOR_PREVIEW,
  READY_FOR_PREVIEW,
  RUNNING,
} = JOB_STATUSES;

const previewJobs = [
  {
    id: '469eba83-41d1-4161-bd1a-0f46d8764c6a',
    hrId: 199482989,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Main bib jobs (MARC)' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Marie',
      lastName: 'Curie',
    },
    progress: {
      current: 23,
      total: 33,
    },
    startedDate: '2018-11-20T14:50:44.000',
    uiStatus: PREPARING_FOR_PREVIEW,
    status: 'PROCESSING_FINISHED',
  },
  {
    id: '469eba83-41d1-4161-bd1a-0f46d876477t',
    hrId: 182982110,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Library indexing' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Marie',
      lastName: 'Doe',
    },
    progress: {
      current: 43,
      total: 70,
    },
    startedDate: '2018-11-20T13:42:44.000',
    uiStatus: PREPARING_FOR_PREVIEW,
    status: 'PROCESSING_FINISHED',
  },
  {
    id: '469eba83-41d1-4161-bd1a-0f46d342177e',
    hrId: 182982111,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Indexing' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Marie',
      lastName: 'Edwards',
    },
    progress: {
      current: 13,
      total: 33,
    },
    startedDate: '2018-11-20T13:11:49.000',
    uiStatus: PREPARING_FOR_PREVIEW,
    status: 'PROCESSING_FINISHED',
  },
  {
    id: '469eba83-41d1-4161-bd1a-0f46d866177d',
    hrId: 182982930,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'Library indexing' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Oliver',
      lastName: 'Clarke',
    },
    progress: {
      current: 33,
      total: 33,
    },
    startedDate: '2018-11-20T13:11:49.000',
    completedDate: '2018-11-20T22:31:34.000',
    uiStatus: READY_FOR_PREVIEW,
    status: 'PROCESSING_FINISHED',
  },
  {
    id: '469eba83-41d1-4161-bd1a-0f46d86999pd',
    hrId: 182982220,
    subordinationType: 'PARENT_SINGLE',
    jobProfileInfo: { name: 'BIB Import from Boston' },
    fileName: 'import_1.mrc',
    sourcePath: 'import_1.mrc',
    runBy: {
      firstName: 'Taylor',
      lastName: 'Clarke',
    },
    progress: {
      current: 5000,
      total: 5000,
    },
    startedDate: '2018-11-20T14:13:49.000',
    completedDate: '2018-11-20T20:51:34.000',
    uiStatus: READY_FOR_PREVIEW,
    status: 'PROCESSING_FINISHED',
  },
];

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

export const jobExecutions = [...previewJobs, ...runningJobs];

export const PREVIEW_JOBS_LENGTH = previewJobs.length;

export const RUNNING_JOBS_LENGTH = runningJobs.length;
