import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { JobsList } from '../JobsList';
import { sortRunningJobs } from './sortRunningJobs';
import { JOB_STATUSES } from '../../../../utils/constants';
import { DataFetcherContext } from '../../../DataFetcher';

export class RunningJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [JOB_STATUSES.RUNNING];
    const jobs = [...get(this.context, ['jobs'], [])]
      .filter(({ uiStatus }) => jobStatuses.includes(uiStatus));

    return sortRunningJobs(jobs);
  }

  render() {
    const { hasLoaded } = this.context;
    const jobs = this.prepareJobsData();

    return (
      <div data-test-running-jobs>
        <JobsList
          jobs={jobs}
          hasLoaded={hasLoaded}
          isEmptyMessage={<FormattedMessage id="ui-data-import.noRunningJobsMessage" />}
        />
      </div>
    );
  }
}
