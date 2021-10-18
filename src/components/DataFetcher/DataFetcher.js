import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  forEach,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { createUrl } from '@folio/stripes-data-transfer-components';
import { DEFAULT_FETCHER_UPDATE_INTERVAL } from '@folio/stripes-data-transfer-components/lib/utils';

import { jobExecutionPropTypes } from '../Jobs/components/Job/jobExecutionPropTypes';
import {
  JOB_STATUSES,
  FILE_STATUSES,
  OCLC_CREATE_INSTANCE_JOB_ID,
  OCLC_UPDATE_INSTANCE_JOB_ID,
} from '../../utils';

import { DataFetcherContext } from '.';

const {
  RUNNING,
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} = JOB_STATUSES;

const {
  COMMITTED,
  ERROR,
  DISCARDED,
} = FILE_STATUSES;

const jobsUrl = createUrl('metadata-provider/jobExecutions', {
  query: `(status="" NOT status=${DISCARDED}) AND (uiStatus==("${PREPARING_FOR_PREVIEW}" OR "${READY_FOR_PREVIEW}" OR "${RUNNING}"))`,
  limit: 50,
}, false);

const logsUrl = createUrl('metadata-provider/jobExecutions', {
  query: `(status any "${COMMITTED} ${ERROR}") 
  AND (jobProfileInfo="\\“id\\“==" NOT jobProfileInfo="\\“id\\“=="${OCLC_CREATE_INSTANCE_JOB_ID}") 
  AND (jobProfileInfo="\\“id\\“==" NOT jobProfileInfo="\\“id\\“=="${OCLC_UPDATE_INSTANCE_JOB_ID}") 
  sortBy completedDate/sort.descending`,
  limit: 25,
}, true);

@stripesConnect
export class DataFetcher extends Component {
  static manifest = Object.freeze({
    jobs: {
      type: 'okapi',
      path: jobsUrl,
      accumulate: true,
      throwErrors: false,
    },
    logs: {
      type: 'okapi',
      path: logsUrl,
      accumulate: true,
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
      }),
      logs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({ jobExecutions: PropTypes.arrayOf(jobExecutionPropTypes).isRequired }),
        ).isRequired,
      }),
    }).isRequired,
    updateInterval: PropTypes.number, // milliseconds
  };

  static defaultProps = { updateInterval: DEFAULT_FETCHER_UPDATE_INTERVAL };

  state = {
    contextData: { // eslint-disable-line object-curly-newline
      hasLoaded: false,
    },
  };

  async componentDidMount() {
    this.mounted = true;
    await this.fetchResourcesData(true);
    this.updateResourcesData();
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timeoutId);
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

    const { mutator } = this.props;

    const fetchResourcesPromises = Object
      .values(mutator)
      .reduce((res, resourceMutator) => res.concat(this.fetchResourceData(resourceMutator)), []);

    try {
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
    const { resources } = this.props;

    const contextData = { hasLoaded: true };

    forEach(resources, (resourceValue, resourceName) => {
      contextData[resourceName] = isEmpty ? [] : get(resourceValue, ['records', 0, 'jobExecutions'], {});
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
