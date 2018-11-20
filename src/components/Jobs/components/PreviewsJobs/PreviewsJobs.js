import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  get,
  filter,
} from 'lodash';

import JobsList from '../JobsList';
import sortPreviewJobs from './sortPreviewJobs';
import { DataFetcherContext } from '../../../DataFetcher/DataFetcherContext';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../../jobStatuses';

class PreviewsJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    let jobs = get(this.context, ['jobs', 'itemsObject', 'jobExecutions'], []);

    jobs = filter(jobs, ({ status }) => status === READY_FOR_PREVIEW || status === PREPARING_FOR_PREVIEW);

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
