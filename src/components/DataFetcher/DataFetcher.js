import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  forEach,
} from 'lodash';

import jobPropTypes from '../Jobs/components/Job/jobPropTypes';
import jobLogPropTypes from '../JobLogs/jobLogPropTypes';
import { DEFAULT_FETCHER_UPDATE_INTERVAL } from '../../utils/constants';
import { createUrl } from '../../utils';
import {
  RUNNING,
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../Jobs/jobStatuses';
import { DataFetcherContext } from '.';

const jobsUrl = createUrl('metadata-provider/jobExecutions', {
  query: `(uiStatus==("${PREPARING_FOR_PREVIEW}" OR "${READY_FOR_PREVIEW}" OR "${RUNNING}"))`,
  limit: 50,
});

const logsUrl = createUrl('metadata-provider/logs', {
  landingPage: true,
  limit: 25,
});

class DataFetcher extends Component {
  static manifest = Object.freeze({
    jobs: {
      type: 'okapi',
      path: jobsUrl,
      accumulate: true,
      throwErrors: false,
    },
    logs: {
      type: 'okapi',
      path: logsUrl + '&query=(status=COMMITTED)', // TODO: remove query once backend issue is fixed
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
      jobs: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
      logs: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      jobs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            jobExecutionDtos: PropTypes.arrayOf(jobPropTypes).isRequired,
          }),
        ).isRequired,
      }),
      logs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            logDtos: PropTypes.arrayOf(jobLogPropTypes).isRequired,
          }),
        ).isRequired,
      }),
    }).isRequired,
    updateInterval: PropTypes.number, // milliseconds
  };

  static defaultProps = { updateInterval: DEFAULT_FETCHER_UPDATE_INTERVAL };

  state = {
    contextData: {
      hasLoaded: false,
    },
  };

  async componentDidMount() {
    this.mounted = true;
    await this.getResourcesData(true);
    this.updateResourcesData();
  }

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.intervalId);
  }

  updateResourcesData() {
    const { updateInterval } = this.props;

    this.intervalId = setInterval(this.getResourcesData, updateInterval);
  }

  /** @param  {boolean} [initial] indicates initial data retrieval */
  getResourcesData = async initial => {
    if (!this.mounted) {
      return;
    }

    const { mutator } = this.props;

    const fetchResourcesPromises = Object.values(mutator)
      .reduce((res, resourceMutator) => {
        return res.concat(this.getResourceData(resourceMutator));
      }, []);

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

  async getResourceData({
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
      contextData[resourceName] = isEmpty ? {} : get(resourceValue, ['records', 0], {});
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

export default DataFetcher;
