import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { JobsList } from '../JobsList';
import { sortPreviewJobs } from './sortPreviewJobs';
import { JOB_STATUSES } from '../../../../utils/constants';
import { DataFetcherContext } from '../../../DataFetcher';

export class PreviewsJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [JOB_STATUSES.READY_FOR_PREVIEW, JOB_STATUSES.PREPARING_FOR_PREVIEW];
    const jobs = get(this.context, ['jobs'], [])
      .filter(({ uiStatus }) => jobStatuses.includes(uiStatus));

    return sortPreviewJobs(jobs);
  }

  render() {
    const { hasLoaded } = this.context;
    const jobs = this.prepareJobsData();

    return (
      <div data-test-preview-jobs>
        <JobsList
          jobs={jobs}
          hasLoaded={hasLoaded}
          isEmptyMessage={<FormattedMessage id="ui-data-import.noPreviewsJobsMessage" />}
        />
      </div>
    );
  }
}
