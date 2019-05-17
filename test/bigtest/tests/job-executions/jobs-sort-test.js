import { expect } from 'chai';
import { isEqual } from 'lodash';
import {
  describe,
  it,
} from '@bigtest/mocha';

import { sortPreviewJobs } from '../../../../src/components/Jobs/components/PreviewsJobs/sortPreviewJobs';
import { sortRunningJobs } from '../../../../src/components/Jobs/components/RunningJobs/sortRunningJobs';
import { JOB_STATUSES } from '../../../../src/utils/constants';

const {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} = JOB_STATUSES;

const ANOTHER_STATUS = 'ANOTHER_STATUS';

const previewJobsUnsorted = [
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-21T20:23:34.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-20T13:51:44.000',
  },
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-21T20:23:34.000',
  },
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-20T20:58:44.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-20T14:32:44.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-22T13:51:44.000',
  },
  {
    uiStatus: ANOTHER_STATUS,
    startedDate: '2018-11-22T14:25:31.000',
  },
  {
    uiStatus: ANOTHER_STATUS,
    startedDate: '2018-11-22T13:51:44.000',
  },
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-20T23:40:44.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-23T13:11:13.000',
  },
];

const previewJobsSorted = [
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-21T20:23:34.000',
  },
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-21T20:23:34.000',
  },
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-20T23:40:44.000',
  },
  {
    uiStatus: READY_FOR_PREVIEW,
    completedDate: '2018-11-20T20:58:44.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-23T13:11:13.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-22T13:51:44.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-20T14:32:44.000',
  },
  {
    uiStatus: PREPARING_FOR_PREVIEW,
    startedDate: '2018-11-20T13:51:44.000',
  },
  {
    uiStatus: ANOTHER_STATUS,
    startedDate: '2018-11-22T14:25:31.000',
  },
  {
    uiStatus: ANOTHER_STATUS,
    startedDate: '2018-11-22T13:51:44.000',
  },
];

const runningJobsUnsorted = [
  { startedDate: '2018-10-19T18:33:45.000' },
  { startedDate: '2018-11-22T17:16:13.000' },
  { startedDate: '2018-10-19T14:32:29.000' },
  { startedDate: '2018-11-22T15:54:44.000' },
  { startedDate: '2018-10-19T14:32:29.000' },
];

const runningJobsSorted = [
  { startedDate: '2018-11-22T17:16:13.000' },
  { startedDate: '2018-11-22T15:54:44.000' },
  { startedDate: '2018-10-19T18:33:45.000' },
  { startedDate: '2018-10-19T14:32:29.000' },
  { startedDate: '2018-10-19T14:32:29.000' },
];

describe('sortPreviewJobs', () => {
  it('sorts correctly', () => {
    const sortFunctionResult = sortPreviewJobs(previewJobsUnsorted);
    const isSortedCorrectly = isEqual(sortFunctionResult, previewJobsSorted);

    expect(isSortedCorrectly).to.be.true;
  });
});

describe('sortRunningJobs', () => {
  it('sorts correctly', () => {
    const sortFunctionResult = sortRunningJobs(runningJobsUnsorted);
    const isSortedCorrectly = isEqual(sortFunctionResult, runningJobsSorted);

    expect(isSortedCorrectly).to.be.true;
  });
});
