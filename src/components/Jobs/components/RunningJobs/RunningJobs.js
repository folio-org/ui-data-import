import React, { PureComponent } from 'react';
import { get } from 'lodash';

import {
  sortRunningJobs,
  JobsListAccordion,
} from '@folio/stripes-data-transfer-components';

import { itemFormatter } from '../../utils';
import { JOB_STATUSES } from '../../../../utils';
import { DataFetcherContext } from '../../../DataFetcher';

// import { Job } from '../Job';

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
        {/* <Job
          job={{
            jobProfileInfo: { name: '1Beelion' },
            fileName: '1Beelion.mrc',
            uiStatus: 'RUNNING',
            hrId: '000048394',
            runBy: {
              firstName: 'Homer',
              lastName: 'J Simpson'
            },
            progress: {
              current: 29,
              total: 50,
            },
          }}
          showPartProgress
        /> */}
        <JobsListAccordion
          jobs={jobs}
          hasLoaded={hasLoaded}
          itemFormatter={itemFormatter}
          titleId="ui-data-import.runningJobs"
          emptyMessageId="ui-data-import.noRunningJobsMessage"
        />
      </div>
    );
  }
}
