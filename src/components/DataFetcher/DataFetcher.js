import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  forEach,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { DEFAULT_FETCHER_UPDATE_INTERVAL } from '@folio/stripes-data-transfer-components/lib/utils';

import { jobExecutionPropTypes } from '../Jobs/components/Job/jobExecutionPropTypes';
import {
  JOB_STATUSES,
  FILE_STATUSES,
  OCLC_CREATE_INSTANCE_JOB_ID,
  OCLC_UPDATE_INSTANCE_JOB_ID,
  createUrlFromArray,
  NO_FILE_NAME,
} from '../../utils';

import { DataFetcherContext } from '.';
import { requestConfiguration } from '../../utils/multipartUpload';

const {
  RUNNING,
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} = JOB_STATUSES;

const {
  COMMITTED,
  ERROR,
  DISCARDED,
  CANCELLED,
} = FILE_STATUSES;

const jobsUrlParams = [
  `statusNot=${DISCARDED}`,
  `uiStatusAny=${PREPARING_FOR_PREVIEW}`,
  `uiStatusAny=${READY_FOR_PREVIEW}`,
  `uiStatusAny=${RUNNING}`,
  'limit=50',
  'sortBy=completed_date,desc',
];

const logsUrlParams = [
  `statusAny=${COMMITTED}`,
  `statusAny=${ERROR}`,
  `statusAny=${CANCELLED}`,
  `profileIdNotAny=${OCLC_CREATE_INSTANCE_JOB_ID}`,
  `profileIdNotAny=${OCLC_UPDATE_INSTANCE_JOB_ID}`,
  `fileNameNotAny=${NO_FILE_NAME}`,
  'limit=25',
  'sortBy=completed_date,desc',
];

const jobsUrl = createUrlFromArray('metadata-provider/jobExecutions', jobsUrlParams);
const logsUrl = createUrlFromArray('metadata-provider/jobExecutions', logsUrlParams);

const compositeJobsUrl = createUrlFromArray('metadata-provider/jobExecutions', [...jobsUrlParams, 'subordinationTypeNotAny=COMPOSITE_CHILD']);
const compositeLogsUrl = createUrlFromArray('metadata-provider/jobExecutions', [...logsUrlParams, 'subordinationTypeNotAny=COMPOSITE_PARENT']);

export function getJobSplittingURL(resources, splittingURL, nonSplitting) {
  const { split_status: splitStatus } = resources;
  if (splitStatus?.records.length > 0 || !splitStatus?.isPending) {
    if (splitStatus?.records[0]?.splitStatus) {
      return splittingURL;
    } else if (splitStatus?.records[0]?.splitStatus === false) {
      return nonSplitting;
    }
  }
  return undefined;
}

@stripesConnect
export class DataFetcher extends Component {
  static manifest = Object.freeze({
    jobs: {
      type: 'okapi',
      path: (_q, _p, resources) => getJobSplittingURL(resources, compositeJobsUrl, jobsUrl),
      accumulate: true,
      throwErrors: false,
    },
    logs: {
      type: 'okapi',
      path: (_q, _p, resources) => getJobSplittingURL(resources, compositeLogsUrl, logsUrl),
      accumulate: true,
      throwErrors: false,
    },
    splitStatus: {
      type: 'okapi',
      path: requestConfiguration,
      shouldRefreshRemote: () => false,
      throwErrors: false,
    },
  });

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    mutator: PropTypes.shape({
      jobs: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
      logs: PropTypes.shape({ GET: PropTypes.func.isRequired }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      jobs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({ jobExecutions: PropTypes.arrayOf(jobExecutionPropTypes).isRequired }),
        ).isRequired,
        hasLoaded: PropTypes.bool,
      }),
      logs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({ jobExecutions: PropTypes.arrayOf(jobExecutionPropTypes).isRequired }),
        ).isRequired,
        hasLoaded: PropTypes.bool,
      }),
      splitStatus: PropTypes.shape({
        hasLoaded: PropTypes.bool,
        records: PropTypes.arrayOf(
          PropTypes.shape({ splitStatus: PropTypes.bool.isRequired }),
        ).isRequired,
      }),
    }).isRequired,
    updateInterval: PropTypes.number, // milliseconds
  };

  static defaultProps = { updateInterval: DEFAULT_FETCHER_UPDATE_INTERVAL };

  state = {
    statusLoaded: false,
    contextData: { // eslint-disable-line object-curly-newline
      hasLoaded: false,
    },
  };

  componentDidMount() {
    const { resources:{ splitStatus } } = this.props;
    const { statusLoaded } = this.state;
    this.mounted = true;
    this.initialFetchPending = false;
    if (!statusLoaded && splitStatus?.hasLoaded) {
      this.setState({ statusLoaded: true }, () => {
        if (!this.initialFetchPending) {
          this.initialize();
        }
      });
    }
  }

  componentDidUpdate(props, state) {
    const { resources:{ splitStatus } } = this.props;
    const { statusLoaded } = state;
    if (!statusLoaded && splitStatus?.hasLoaded) {
      this.setState({ statusLoaded: true }, () => {
        if (!this.initialFetchPending) {
          this.initialize();
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timeoutId);
  }

  initialize = async () => {
    await this.fetchResourcesData(true);
    this.updateResourcesData();
  }

  updateResourcesData() {
    const { updateInterval } = this.props;

    this.timeoutId = setTimeout(async () => {
      await this.fetchResourcesData();

      this.updateResourcesData();
    }, updateInterval);
  }

  /** @param  {boolean} [initial] indicates initial data retrieval */
  fetchResourcesData = async initial => {
    /* istanbul ignore if  */
    if (!this.mounted) {
      return;
    }

    const { mutator: { jobs, logs } } = this.props;

    const fetchResourcesPromises = Object
      .values({ jobs, logs })
      .reduce((res, resourceMutator) => res.concat(this.fetchResourceData(resourceMutator)), []);

    try {
      this.initialFetchPending = true;
      await Promise.all(fetchResourcesPromises);
      this.mapResourcesToState();
    } catch (error) {
      if (initial) {
        // fill contextData with empty data on unsuccessful initial data retrieval
        this.mapResourcesToState(true);
      }
      // TODO: should be described in UIDATIMP-53
    }
  };

  async fetchResourceData({
    GET,
    reset,
  }) {
    // accumulate: true in manifest saves the results of all requests
    // because of that it is required to clear old data by invoking reset method before each request
    reset();
    await GET();
  }

  /** @param  {boolean} [isEmpty] flag to fill contextData with empty data */
  mapResourcesToState(isEmpty) {
    const { resources: { jobs, logs } } = this.props;

    const contextData = { hasLoaded: (jobs.hasLoaded && logs.hasLoaded) };

    forEach({ jobs, logs }, (resourceValue, resourceName) => {
      contextData[resourceName] = isEmpty ? [] : get(resourceValue, ['records', 0, 'jobExecutions'], []);
    });

    this.setState({ contextData });
  }

  render() {
    const { children } = this.props;
    const { contextData } = this.state;

    return (
      <DataFetcherContext.Provider value={contextData}>
        {children}
      </DataFetcherContext.Provider>
    );
  }
}
