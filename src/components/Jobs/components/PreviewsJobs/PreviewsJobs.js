import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import JobsList from '../JobsList';
import sortPreviewJobs from './sortPreviewJobs';
import {
  PROCESSING_FINISHED,
  PROCESSING_IN_PROGRESS,
} from '../../jobStatuses';
import { DataFetcherContext } from '../../../DataFetcher/DataFetcherContext';

class PreviewsJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [PROCESSING_FINISHED, PROCESSING_IN_PROGRESS]; // TODO: could be changed on backend
    const jobs = get(this.context, ['jobs', 'itemsObject', 'jobExecutionDtos'], [])
      .filter(({ status }) => jobStatuses.includes(status));

    return sortPreviewJobs(jobs);
  }

  render() {
    const hasLoaded = get(this.context, ['jobs', 'hasLoaded'], false);
    const jobs = this.prepareJobsData();

    return (
      <JobsList
        jobs={jobs}
        hasLoaded={hasLoaded}
        noJobsMessage={<FormattedMessage id="ui-data-import.noPreviewsJobsMessage" />}
      />
    );
  }
}

export default PreviewsJobs;
