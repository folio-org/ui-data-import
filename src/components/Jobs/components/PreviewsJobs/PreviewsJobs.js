import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import JobsList from '../JobsList';
import sortPreviewJobs from './sortPreviewJobs';
import { DataFetcherContext } from '../../../DataFetcher/DataFetcherContext';

class PreviewsJobs extends PureComponent {
  static propTypes = {
    checkDateIsToday: PropTypes.func.isRequired,
    noJobsMessage: PropTypes.node,
  };

  static defaultProps = {
    noJobsMessage: '',
  };

  static contextType = DataFetcherContext;

  render() {
    const {
      checkDateIsToday,
      noJobsMessage,
    } = this.props;
    const { jobsPreviews = {} } = this.context;
    const { jobExecutionDtos: jobs = [] } = get(jobsPreviews, 'itemsObject', {});
    const { hasLoaded = false } = jobsPreviews;

    return (
      <JobsList
        jobs={jobs}
        hasLoaded={hasLoaded}
        checkDateIsToday={checkDateIsToday}
        sort={sortPreviewJobs}
        noJobsMessage={noJobsMessage}
      />
    );
  }
}

export default PreviewsJobs;
