import React, { PureComponent } from 'react';
import { get } from 'lodash';

import { JobsListAccordion } from '@folio/stripes-data-transfer-components';

import { itemFormatter } from '../../utils';
import { sortPreviewJobs } from './sortPreviewJobs';
import { JOB_STATUSES } from '../../../../utils';
import { DataFetcherContext } from '../../../DataFetcher';

export class PreviewsJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [JOB_STATUSES.READY_FOR_PREVIEW, JOB_STATUSES.PREPARING_FOR_PREVIEW];
    const jobs = [...get(this.context, ['jobs'], [])]
      .filter(({ uiStatus }) => jobStatuses.includes(uiStatus));

    return sortPreviewJobs(jobs);
  }

  render() {
    const { hasLoaded } = this.context;
    const jobs = this.prepareJobsData();

    return (
      <div data-test-preview-jobs>
        <JobsListAccordion
          jobs={jobs}
          hasLoaded={hasLoaded}
          itemFormatter={itemFormatter}
          titleId="ui-data-import.previewJobs"
          emptyMessageId="ui-data-import.noPreviewsJobsMessage"
        />
      </div>
    );
  }
}
