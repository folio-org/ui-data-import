import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import jobPropTypes from '../Jobs/components/Job/jobPropTypes';
import {
  READY_FOR_PREVIEW,
  PREPARING_FOR_PREVIEW,
} from '../Jobs/jobStatuses';
import { DataFetcherContextProvider } from './DataFetcherContext';

const DEFAULT_UPDATE_INTERVAL = 5000;

export default class DataFetcher extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    mutator: PropTypes.shape({
      jobsPreviews: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      jobsPreviews: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape(
            PropTypes.arrayOf({
              jobs: PropTypes.arrayOf(jobPropTypes).isRequired,
            }).isRequired,
          ).isRequired,
        ),
      }),
    }).isRequired,
    updateInterval: PropTypes.number, // milliseconds
  };

  static defaultProps = {
    updateInterval: DEFAULT_UPDATE_INTERVAL,
  };

  static manifest = Object.freeze({
    jobsPreviews: {
      type: 'okapi',
      path: 'metadata-provider/jobExecutions',
      accumulate: true,
      throwErrors: false,
      params: {
        query: `(status=${READY_FOR_PREVIEW}, ${PREPARING_FOR_PREVIEW})`, // TODO: possible subject to change in future
      },
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

    Object.keys(mutator).forEach(resourceName => {
      this.setState(({ contextData }) => ({
        contextData: {
          ...contextData,
          [resourceName]: {
            hasLoaded: false,
          },
        },
      }));
    });
  }

  getResourcesData = () => {
    const { mutator } = this.props;

    Object.entries(mutator).forEach(([resourceName, resourceMutator]) => {
      this.getResourceData(resourceName, resourceMutator);
    });
  };

  getResourceData(resourceName, resourceMutator) {
    const { GET, reset } = resourceMutator;

    // accumulate: true in manifest saves the results of all requests
    // because of that it is required to clear old data by invoking reset method before each request
    reset();
    GET()
      .then(() => this.setState(({ contextData }) => ({
        contextData: {
          ...contextData,
          [resourceName]: {
            hasLoaded: true,
            itemsObject: get(this.props, ['resources', resourceName, 'records', 0], {}),
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
