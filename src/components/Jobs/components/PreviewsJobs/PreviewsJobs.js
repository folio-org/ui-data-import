import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import JobsList from '../JobsList';
import sortPreviewJobs from './sortPreviewJobs';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';
import { DataFetcherContext } from '../../../DataFetcher/DataFetcherContext';

class PreviewsJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [READY_FOR_PREVIEW, PREPARING_FOR_PREVIEW]; // TODO: could be changed on backend
    const jobs = get(this.context, ['jobs', 'itemsObject', 'jobExecutions'], [])
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
