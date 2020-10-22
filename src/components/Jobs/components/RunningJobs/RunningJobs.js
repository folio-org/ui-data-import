import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { JobsList } from '@folio/stripes-data-transfer-components';

import { itemFormatter } from '../../utils';
import { sortRunningJobs } from './sortRunningJobs';
import { JOB_STATUSES } from '../../../../utils';
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
          itemFormatter={itemFormatter}
          isEmptyMessage={<FormattedMessage id="ui-data-import.noRunningJobsMessage" />}
        />
      </div>
    );
  }
}
