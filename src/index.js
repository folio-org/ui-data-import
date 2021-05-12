import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { stripesShape } from '@folio/stripes/core';

import {
  Home,
  JobProfile,
  JobSummary,
  ViewJobLog,
} from './routes';
import ViewAllLogs from './routes/ViewAllLogs';
import { DataImportSettings } from './settings';
import { UploadingJobsContextProvider } from './components';

class DataImport extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    showSettings: PropTypes.bool,
  };

  static defaultProps = { showSettings: false };

  render() {
    const {
      showSettings,
      match: { path },
    } = this.props;

    if (showSettings) {
      return <DataImportSettings {...this.props} />;
    }

    return (
      <UploadingJobsContextProvider>
        <Switch>
          <Route
            path={path}
            exact
            component={Home}
          />
          <Route
            path={`${path}/job-profile`}
            component={JobProfile}
          />
          <Route
            path={`${path}/log/:id/:recordId`}
            exact
            component={ViewJobLog}
          />
          <Route
            path={`${path}/job-summary/:id`}
            exact
            component={JobSummary}
          />
          <Route
            path={`${path}/job-logs`}
            component={ViewAllLogs}
          />
        </Switch>
      </UploadingJobsContextProvider>
    );
  }
}

export default DataImport;
