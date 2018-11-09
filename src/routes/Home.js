import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
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
    stripes: stripesShape.isRequired,
    resources: PropTypes.shape({
      logs: PropTypes.object,
    }),
    intl: intlShape.isRequired,
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
      stripes,
      resources: { logs },
      intl: { formatMessage },
    } = this.props;

    return (
      <Paneset>
        <Pane
          defaultWidth="320px"
          paneTitle={formatMessage({ id: 'ui-data-import.jobsPaneTitle' })}
          lastMenu={this.addManageJobs()}
        >
          <Jobs stripes={stripes} />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={formatMessage({ id: 'ui-data-import.logsPaneTitle' })}
          lastMenu={this.addViewAllLogs()}
        >
          <JobLogs resource={logs} />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={formatMessage({ id: 'ui-data-import.importPaneTitle' })}
        >
          <ImportJobs stripes={stripes} />
        </Pane>
      </Paneset>
    );
  }
}

export default injectIntl(Home);
