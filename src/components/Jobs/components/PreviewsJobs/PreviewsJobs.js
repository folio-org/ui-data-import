import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import JobsList from '../JobsList';
import sortPreviewJobs from './sortPreviewJobs';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';
import { DataFetcherContext } from '../../../DataFetcher';

class PreviewsJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW];
    const jobs = get(this.context, ['jobs', 'jobExecutionDtos'], [])
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
          noJobsMessage={<FormattedMessage id="ui-data-import.noPreviewsJobsMessage" />}
        />
      </div>
    );
  }
}

export default PreviewsJobs;
