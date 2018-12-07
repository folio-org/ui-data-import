import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import jobPropTypes from '../Jobs/components/Job/jobPropTypes';
import jobLogPropTypes from '../JobLogs/jobLogPropTypes';
import { createUrl } from '../../utils';
import {
  PROCESSING_IN_PROGRESS,
  PROCESSING_FINISHED,
  PARSING_IN_PROGRESS,
} from '../Jobs/jobStatuses';
import { DataFetcherContextProvider } from '.';

const DEFAULT_UPDATE_INTERVAL = 5000;

const jobsUrl = createUrl('metadata-provider/jobExecutions', {
  query: `(status=("${PROCESSING_IN_PROGRESS}" OR "${PROCESSING_FINISHED}" OR "${PARSING_IN_PROGRESS}"))`,
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

  static defaultProps = {
    updateInterval: DEFAULT_UPDATE_INTERVAL,
  };

  state = {
    contextData: {
      hasLoaded: false,
    },
  };

  componentDidMount() {
    this.getResourcesData();
    this.updateResourcesData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  hasLoaded = false;

  updateResourcesData() {
    const { updateInterval } = this.props;

    this.intervalId = setInterval(this.getResourcesData, updateInterval);
  }

  getResourcesData = async () => {
    const { mutator } = this.props;

    const fetchResourcesPromises = Object.values(mutator)
      .reduce((res, resourceMutator) => {
        return res.concat(this.getResourceData(resourceMutator));
      }, []);

    this.hasLoaded = true;

    try {
      await Promise.all(fetchResourcesPromises);

      this.mapResourcesToState();
    } catch (e) {
      if (this.hasLoaded) {
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

  /**
   * @param  {boolean} [isEmpty] flag to fill contextData with empty data
   */
  mapResourcesToState(isEmpty) {
    const { resources } = this.props;
    const contextData = { hasLoaded: true };

    Object.entries(resources)
      .forEach(([resourceName, resourceValue]) => {
        contextData[resourceName] = isEmpty ? {} : get(resourceValue, ['records', 0], {});
      });

    this.setState({ contextData });
  }

  render() {
    const { children } = this.props;
    const { contextData } = this.state;

    return (
      <DataFetcherContextProvider value={contextData}>
        {children}
      </DataFetcherContextProvider>
    );
  }
}

export default DataFetcher;
