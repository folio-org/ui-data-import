import React, {
  Component,
  createRef
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEqual,
  get,
} from 'lodash';

import {
  Button,
  Pane,
  ConfirmationModal,
  Callout,
  ErrorModal,
} from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  stripesShape,
  withStripes,
  withRoot,
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
  storage,
  STATE_MANAGEMENT_LANDING,
  trimLeadNumbers,
} from '../utils';
import { jobExecutionsReducer } from '../redux/reducers/jobExecutionsReducer';
import {
  deleteHrid,
  deselectRecord,
} from '../redux/actions/jobExecutionsActionCreator';

const mapStateToProps = state => {
  const { hrIds, selectedJob } = get(state, 'folio-data-import_landing', {});
  return { hrIds, selectedJob };
};

const mapDispatchToProps = dispatch => ({
  removeHRID: hrId => dispatch(deleteHrid(hrId)),
  deselectRecord: () => dispatch(deselectRecord()),
});

@withCheckboxList({ pageKey: PAGE_KEYS.HOME })
@withStripes
@withRoot
@connect(mapStateToProps, mapDispatchToProps)
export class Home extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
    root: PropTypes.shape({
      addReducer: PropTypes.func.isRequired,
    }).isRequired,
    hrIds: PropTypes.arrayOf(PropTypes.number),
    selectedJob: PropTypes.number,
    removeHRID: PropTypes.func,
    deselectRecord: PropTypes.func,
  };

  static defaultProps = { actionMenuItems: ['viewAllLogs', 'deleteSelectedLogs'] };

  static contextType = DataFetcherContext;

  static getDerivedStateFromProps(nextProps, prevState) {
    const { checkboxList: { selectedRecords } } = nextProps;

    if (selectedRecords.size !== prevState.selectedLogsNumber) {
      storage.setItem(PAGE_KEYS.HOME, [...selectedRecords]);

      return { selectedLogsNumber: selectedRecords.size };
    }

    return null;
  }

  constructor(props) {
    super(props);

    props.root.addReducer(STATE_MANAGEMENT_LANDING.REDUCER, jobExecutionsReducer);

    this.renderLogsPaneSub = this.renderLogsPaneSub.bind(this);

    this.calloutRef = createRef();
    this.state = {
      isLogsDeletionInProgress: false,
      logs: [],
      selectedLogsNumber: 0,
      showDeleteConfirmation: false,
      isShowFinishedJobModalOpen: false,
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.context.logs && !isEqual(prevState.logs, this.context.logs)) {
      this.setLogsList();

      // enable checkboxes after deletion completed if user has deleted logs
      if (this.state.isLogsDeletionInProgress) {
        this.setState({ isLogsDeletionInProgress: false });
      }
    }
  }

  setLogsList() {
    const { setList } = this.props;
    const { logs } = this.context;

    setList(logs);
    this.setState({ logs });
    this.onLogsUpdate(logs);
  }

  onLogsUpdate = logs => {
    for (let i = 0; i < logs.length; i++) {
      const logHRID = logs[i].hrId;

      if (this.props.hrIds.includes(logHRID)) {
        this.props.removeHRID(logHRID);
        if (this.props.selectedJob === logHRID) {
          this.openFinishedJobModal();
        }
        this.props.deselectRecord();
      }
    }
    return false;
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
        baseUrl="/data-import"
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

    // disable all checkboxes while deletion in progress
    this.setState({ isLogsDeletionInProgress: true });

    deleteJobExecutions(selectedRecords, okapi)
      .then(onSuccess)
      .catch(() => this.showDeleteLogsErrorMessage());
  }

  // is used by menuTemplate
  isDeleteAllLogsDisabled() {
    return this.state.selectedLogsNumber === 0;
  }

  openFinishedJobModal = () => {
    this.setState({ isShowFinishedJobModalOpen: true });
  };

  closeFinishedJobModal = () => {
    this.setState({ isShowFinishedJobModalOpen: false });
  };

  render() {
    const {
      logs,
      hasLoaded,
    } = this.context;
    const { checkboxList } = this.props;
    const {
      isLogsDeletionInProgress,
      isShowFinishedJobModalOpen,
    } = this.state;

    const trimmedLogs = logs?.map((log) => ({
      ...log,
      fileName: trimLeadNumbers(log.fileName),
    }));

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
            logs={trimmedLogs}
            haveLogsLoaded={hasLoaded}
            checkboxList={checkboxList}
            checkboxesDisabled={isLogsDeletionInProgress}
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
        <ErrorModal
          ariaLabel="confirm-finished-job-modal"
          open={isShowFinishedJobModalOpen}
          label={<FormattedMessage id="ui-data-import.modal.confirmJobFinished.header" />}
          content={<FormattedMessage id="ui-data-import.modal.confirmJobFinished.message" />}
          onClose={this.closeFinishedJobModal}
        />
        <Callout ref={this.calloutRef} />
      </PersistedPaneset>
    );
  }
}
