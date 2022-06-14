import React, {
  Component,
  createRef
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Pane,
  ConfirmationModal,
  Callout,
} from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  stripesShape,
  withRoot,
  withStripes,
} from '@folio/stripes/core';

import {
  Jobs,
  RecentJobLogs,
  ImportJobs,
  ActionMenu,
  DataFetcherContext,
} from '../components';

import {
  checkboxListShape,
  withCheckboxList,
  deleteJobExecutions,
  PAGE_KEYS,
} from '../utils';
import { setSelectedRecords } from '../redux';

@withCheckboxList({ pageKey: PAGE_KEYS.HOME })
@withRoot
@withStripes
export class Home extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    root: PropTypes.shape({
      store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = { actionMenuItems: ['viewAllLogs', 'deleteSelectedLogs'] };

  static contextType = DataFetcherContext;

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      checkboxList: { selectedRecords },
      root: { store: { dispatch } },
    } = nextProps;

    if (selectedRecords.size !== prevState.selectedLogsNumber) {
      // persist selected records in redux store with associated page key
      dispatch(setSelectedRecords({ [PAGE_KEYS.HOME]: selectedRecords }));

      return { selectedLogsNumber: selectedRecords.size };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.renderLogsPaneSub = this.renderLogsPaneSub.bind(this);

    this.calloutRef = createRef();
    this.state = {
      allLogsNumber: null,
      selectedLogsNumber: 0,
      showDeleteConfirmation: false,
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.context.logs && (prevState.allLogsNumber !== this.context.logs.length)) {
      this.setLogsList();
    }
  }

  setLogsList() {
    const { setList } = this.props;
    const { logs } = this.context;

    setList(logs);
    this.setState({ allLogsNumber: logs.length });
  }

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

  renderViewAllLogs(menu) {
    return (
      <ActionMenu
        entity={this}
        menu={menu}
      />
    );
  }

  renderLogsPaneSub() {
    const logsNumber = this.state.selectedLogsNumber;

    return (
      logsNumber === 0
        ? null
        : (
          <FormattedMessage
            id="ui-data-import.logsSelected"
            values={{ logsNumber }}
          />
        )
    );
  }

  showDeleteConfirmation() {
    this.setState({ showDeleteConfirmation: true });
  }

  hideDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: false });
  };

  showDeleteLogsSuccessfulMessage(logsNumber) {
    this.calloutRef.current.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage
          id="ui-data-import.landing.callout.success"
          values={{ logsNumber }}
        />
      ),
    });
  }

  showDeleteLogsErrorMessage() {
    this.calloutRef.current.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-data-import.communicationProblem" />,
    });
  }

  deleteLogs() {
    const {
      stripes: { okapi },
      checkboxList: {
        selectedRecords,
        deselectAll,
      },
    } = this.props;

    const onSuccess = result => {
      const { jobExecutionDetails } = result;

      deselectAll();
      this.hideDeleteConfirmation();
      this.showDeleteLogsSuccessfulMessage(jobExecutionDetails.length);
    };

    deleteJobExecutions(selectedRecords, okapi)
      .then(onSuccess)
      .catch(() => this.showDeleteLogsErrorMessage());
  }

  isDeleteAllLogsDisabled() {
    return this.state.selectedLogsNumber === 0;
  }

  render() {
    const {
      logs,
      hasLoaded,
    } = this.context;
    const { checkboxList } = this.props;

    return (
      <PersistedPaneset
        appId="@folio/data-import"
        id="home-paneset"
      >
        <Pane
          id="pane-jobs-title"
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
          id="pane-logs-title"
          defaultWidth="fill"
          paneTitle={<FormattedMessage id="ui-data-import.logsPaneTitle" />}
          paneSub={this.renderLogsPaneSub()}
          actionMenu={menu => this.renderViewAllLogs(menu)}
          padContent={false}
        >
          <RecentJobLogs
            logs={logs}
            haveLogsLoaded={hasLoaded}
            checkboxList={checkboxList}
          />
        </Pane>
        <ConfirmationModal
          id="delete-selected-logs-modal"
          open={this.state.showDeleteConfirmation}
          heading={<FormattedMessage id="ui-data-import.modal.landing.delete.header" />}
          message={(
            <FormattedMessage
              id="ui-data-import.modal.landing.delete.message"
              values={{ logsNumber: this.state.selectedLogsNumber }}
            />
          )}
          bodyTag="div"
          confirmLabel={<FormattedMessage id="ui-data-import.modal.landing.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.modal.landing.cancel" />}
          onConfirm={() => this.deleteLogs()}
          onCancel={() => {
            this.props.checkboxList.deselectAll();
            this.hideDeleteConfirmation();
          }}
        />
        <Callout ref={this.calloutRef} />
      </PersistedPaneset>
    );
  }
}
