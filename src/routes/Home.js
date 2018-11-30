import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';

import {
  Button,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import Jobs from '../components/Jobs';
import JobLogs from '../components/JobLogs';
import ImportJobs from '../components/ImportJobs';
import DataFetcher from '../components/DataFetcher';

class Home extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    const { connect } = props.stripes;

    this.connectedDataFetcher = connect(DataFetcher);
  }

  handleManageJobs = () => {
    // TODO: to be implemented in further stories
  };

  handleViewAllLogs = () => {
    // TODO: to be implemented in further stories
  };

  addManageJobs() {
    return (
      <Button
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
        onClick={this.handleManageJobs}
      >
        <FormattedMessage id="ui-data-import.manageJobs" />
      </Button>
    );
  }

  addViewAllLogs() {
    return (
      <Button
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
        onClick={this.handleViewAllLogs}
      >
        <FormattedMessage id="ui-data-import.viewAllLogs" />
      </Button>
    );
  }

  render() {
    return (
      <this.connectedDataFetcher>
        <Paneset>
          <Pane
            defaultWidth="320px"
            paneTitle={<FormattedMessage id="ui-data-import.jobsPaneTitle" />}
            lastMenu={this.addManageJobs()}
          >
            <Jobs />
          </Pane>
          <Pane
            defaultWidth="fill"
            paneTitle={<FormattedMessage id="ui-data-import.logsPaneTitle" />}
            lastMenu={this.addViewAllLogs()}
          >
            <JobLogs />
          </Pane>
          <Pane
            defaultWidth="fill"
            paneTitle={<FormattedMessage id="ui-data-import.importPaneTitle" />}
          >
            <ImportJobs />
          </Pane>
        </Paneset>
      </this.connectedDataFetcher>
    );
  }
}

export default Home;
