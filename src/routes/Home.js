import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import Jobs from '../components/Jobs';
import JobLogs from '../components/JobLogs';
import ImportJobs from '../components/ImportJobs';

class Home extends Component {
  static propTypes = {
    resources: PropTypes.shape({
      logs: PropTypes.object,
    }),
  };

  static defaultProps = {
    resources: {
      logs: {},
    }
  };

  static manifest = Object.freeze({
    logs: {
      type: 'okapi',
      path: 'metadata-provider/logs?landingPage=true',
      throwErrors: false,
    },
  });

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
    const {
      resources: { logs },
    } = this.props;

    return (
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
          <JobLogs resource={logs} />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={<FormattedMessage id="ui-data-import.importPaneTitle" />}
        >
          <ImportJobs />
        </Pane>
      </Paneset>
    );
  }
}

export default Home;
