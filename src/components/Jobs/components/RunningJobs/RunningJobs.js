import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  get,
  filter,
} from 'lodash';

import JobsList from '../JobsList';
import sortRunningJobs from './sortRunningJobs';
import { DataFetcherContext } from '../../../DataFetcher/DataFetcherContext';
import { RUNNING } from '../../jobStatuses';

class RunningJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    let jobs = get(this.context, ['jobs', 'itemsObject', 'jobExecutions'], []);

    jobs = filter(jobs, ['status', RUNNING]);

    return sortRunningJobs(jobs);
  }

  render() {
    const hasLoaded = get(this.context, ['jobs', 'hasLoaded'], false);
    const jobs = this.prepareJobsData();

    return (
      <JobsList
        jobs={jobs}
        hasLoaded={hasLoaded}
        noJobsMessage={<FormattedMessage id="ui-data-import.noRunningJobsMessage" />}
      />
    );
  }
}

export default RunningJobs;
