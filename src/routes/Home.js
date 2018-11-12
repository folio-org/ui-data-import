import React from 'react';
import { FormattedMessage } from 'react-intl';
import { stripesShape } from '@folio/stripes/core';
import { Button, Pane, Paneset } from '@folio/stripes/components';

import Jobs from '../components/Jobs';
import ImportJobs from '../components/ImportJobs';
import DataFetcher from '../components/DataFetcher';

export default class Home extends React.Component {
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
    const { stripes } = this.props;
    const { formatMessage } = stripes.intl;

    return (
      <this.connectedDataFetcher>
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
          />
          <Pane
            defaultWidth="fill"
            paneTitle={formatMessage({ id: 'ui-data-import.importPaneTitle' })}
          >
            <ImportJobs stripes={stripes} />
          </Pane>
        </Paneset>
      </this.connectedDataFetcher>
    );
  }
}
