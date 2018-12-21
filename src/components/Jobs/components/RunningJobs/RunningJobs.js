import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import JobsList from '../JobsList';
import sortRunningJobs from './sortRunningJobs';
import { RUNNING } from '../../jobStatuses';
import { DataFetcherContext } from '../../../DataFetcher';

class RunningJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [RUNNING];
    const jobs = get(this.context, ['jobs', 'jobExecutionDtos'], [])
      .filter(({ uiStatus }) => jobStatuses.includes(uiStatus));

    return sortRunningJobs(jobs);
  }

  render() {
    const { hasLoaded } = this.context;
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
