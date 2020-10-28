import { expect } from 'chai';
import { isEqual } from 'lodash';
import {
  describe,
  it,
} from '@bigtest/mocha';

import { sortPreviewJobs } from '../../../../src/components/Jobs/components/PreviewsJobs/sortPreviewJobs';
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

describe('sortPreviewJobs', () => {
  it('sorts correctly', () => {
    const sortFunctionResult = sortPreviewJobs(previewJobsUnsorted);
    const isSortedCorrectly = isEqual(sortFunctionResult, previewJobsSorted);

    expect(isSortedCorrectly).to.be.true;
  });
});
