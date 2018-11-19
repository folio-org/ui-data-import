import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import jobPropTypes from '../Jobs/components/Job/jobPropTypes';
import { DataFetcherContextProvider } from './DataFetcherContext';

const DEFAULT_UPDATE_INTERVAL = 5000;

class DataFetcher extends Component {
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
    }),
    resources: PropTypes.shape({
      jobs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape(
            PropTypes.arrayOf({
              jobExecutions: PropTypes.arrayOf(jobPropTypes).isRequired,
            }).isRequired,
          ).isRequired,
        ),
      }),
      logs: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape(
            PropTypes.arrayOf({
              logs: PropTypes.arrayOf(jobPropTypes).isRequired,
            }).isRequired,
          ).isRequired,
        ),
      }),
    }),
    updateInterval: PropTypes.number, // milliseconds
  };

  static defaultProps = {
    updateInterval: DEFAULT_UPDATE_INTERVAL,
  };

  static manifest = Object.freeze({
    jobs: {
      type: 'okapi',
      path: 'metadata-provider/jobExecutions',
      accumulate: true,
      throwErrors: false,
    },
    logs: {
      type: 'okapi',
      path: 'metadata-provider/logs?landingPage=true',
      accumulate: true,
      throwErrors: false,
    },
  });

  state = {
    contextData: {},
  };

  componentDidMount() {
    this.setInitialState();
    this.getResourcesData();
    this.updateResourcesData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  updateResourcesData() {
    const { updateInterval } = this.props;

    this.intervalId = setInterval(this.getResourcesData, updateInterval);
  }

  setInitialState() {
    const { mutator } = this.props;

    Object.keys(mutator)
      .forEach(resourceName => this.setState(({ contextData }) => ({
        contextData: {
          ...contextData,
          [resourceName]: {
            hasLoaded: false,
          },
        },
      })));
  }

  getResourcesData = async () => {
    const { mutator } = this.props;
    const fetchResourcesPromises = [];

    Object.values(mutator)
      .forEach(resourceMutator => fetchResourcesPromises.push(this.getResourceData(resourceMutator)));

    try {
      await Promise.all(fetchResourcesPromises);

      this.mapResourcesToState();
    } catch ({ message }) {
      // TODO: error handling logic
    }
  };

  async getResourceData({ GET, reset }) {
    // accumulate: true in manifest saves the results of all requests
    // because of that it is required to clear old data by invoking reset method before each request
    reset();
    await GET();
  }

  mapResourcesToState() {
    const { resources } = this.props;

    Object.entries(resources)
      .forEach(([resourceName, resourceValue]) => this.setState(({ contextData }) => ({
        contextData: {
          ...contextData,
          [resourceName]: {
            hasLoaded: true,
            itemsObject: get(resourceValue, ['records', 0]),
          },
        },
      })));
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
