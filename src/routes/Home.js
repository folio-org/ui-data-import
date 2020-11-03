import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import {
  Jobs,
  RecentJobLogs,
  ImportJobs,
  DataFetcher,
} from '../components';

export class Home extends Component {
  handleManageJobs = () => {
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
        to="/data-import/job-logs?sort=-completedDate"
      >
        <FormattedMessage id="ui-data-import.viewAllLogs" />
      </Button>
    );
  }

  render() {
    return (
      <Paneset>
        <DataFetcher>
          <Pane
            data-test-jobs-pane
            defaultWidth="320px"
            paneTitle={(
              <span data-test-title>
                <FormattedMessage id="ui-data-import.jobsPaneTitle" />
              </span>
            )}
            // commented in scope of UIDATIMP-652
            // TODO: should be uncomment after addManageJobs function implementation
            // lastMenu={this.addManageJobs()}
          >
            <ImportJobs />
            <Jobs />
          </Pane>
          <Pane
            defaultWidth="fill"
            paneTitle={<FormattedMessage id="ui-data-import.logsPaneTitle" />}
            lastMenu={this.addViewAllLogs()}
            padContent={false}
          >
            <RecentJobLogs />
          </Pane>
        </DataFetcher>
      </Paneset>
    );
  }
}
