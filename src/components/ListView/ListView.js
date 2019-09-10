import React, {
  Component,
  Fragment,
  createRef,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  get,
  isEmpty,
} from 'lodash';

import { IntlConsumer } from '@folio/stripes/core';
import {
  Callout,
  ConfirmationModal,
} from '@folio/stripes/components';
import { buildUrl } from '@folio/stripes/smart-components';

import {
  checkboxListShape,
  trimSearchTerm,
} from '../../utils';
import { getCRUDActions } from '../ViewContainer/getCRUDActions';
import { SearchAndSort } from '../SearchAndSort';
import { ViewContainer } from '../ViewContainer';
import { listTemplate } from '../ListTemplate';
import { ActionMenu } from '../ActionMenu';
import { createNetworkMessage } from '../Callout';

export class ListView extends Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedRecord: PropTypes.object,
    checkboxList: checkboxListShape,
    setList: PropTypes.func.isRequired,
    showSingleResult: PropTypes.bool,
    objectName: PropTypes.string,
    RecordView: PropTypes.func.isRequired,
    RecordForm: PropTypes.func,
    INITIAL_RESULT_COUNT: PropTypes.number,
    RESULT_COUNT_INCREMENT: PropTypes.number,
    ENTITY_KEY: PropTypes.string,
    detailProps: PropTypes.object,
    withNewRecordButton: PropTypes.bool,
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    columnWidths: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    renderHeaders: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showSingleResult: true,
    INITIAL_RESULT_COUNT: 5000,
    RESULT_COUNT_INCREMENT: 5000,
    ENTITY_KEY: '',
    withNewRecordButton: true,
    selectedRecord: {
      record: null,
      hasLoaded: false,
    },
    checkboxList: {},
  };

  state = {
    showRestoreModal: false,
    restoreInProgress: false,
  };

  componentDidMount() {
    const {
      ENTITY_KEY,
      mutator,
    } = this.props;

    this.CRUDActions = getCRUDActions({
      ENTITY_KEY,
      mutator,
      onSuccess: createNetworkMessage('success', ENTITY_KEY, this.calloutRef),
      onError: createNetworkMessage('error', ENTITY_KEY, this.calloutRef),
    });
    this.setList();
  }

  componentDidUpdate(prevProps) {
    const { resources } = this.props;

    if (prevProps.resources !== resources) {
      this.setList();
    }
  }

  calloutRef = createRef();

  get entityList() {
    const { ENTITY_KEY } = this.props;

    return get(this.props.resources, [ENTITY_KEY, 'records'], []);
  }

  setList() {
    const { setList } = this.props;

    setList(this.entityList);
  }

  transitionToParams = params => {
    const {
      history,
      location,
    } = this.props;

    history.push(buildUrl(location, params));
  };

  showRestoreConfirmation() {
    this.setState({ showRestoreModal: true });
  }

  handleHideRestoreModal = () => {
    this.setState({ restoreInProgress: false });
    this.setState({ showRestoreModal: false });
  };

  handleRestoreSuccess = () => {
    const { match: { path } } = this.props;

    this.transitionToParams({
      _path: `${path}/view`,
      layer: null,
    });
    this.handleHideRestoreModal();
  };

  handleRestoreError = () => {
    this.handleHideRestoreModal();
  };

  restoreDefaults = async () => {
    if (this.state.restoreInProgress) {
      return;
    }

    const record = {};

    try {
      await this.setState({ restoreInProgress: true });
      await this.CRUDActions.onRestoreDefaults(record);
      this.handleRestoreSuccess();
    } catch (error) {
      this.handleRestoreError();
    }
  };

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  rowUpdater = ({ id }) => {
    const { checkboxList: { selectedRecords } } = this.props;

    return selectedRecords.has(id);
  };

  render() {
    const {
      resources,
      mutator,
      location: { search },
      label,
      location,
      history,
      match,
      showSingleResult,
      selectedRecord,
      checkboxList: {
        selectedRecords,
        selectRecord,
        deselectAll,
      },
      objectName,
      INITIAL_RESULT_COUNT,
      RESULT_COUNT_INCREMENT,
      initialValues,
      ENTITY_KEY,
      withNewRecordButton,
      detailProps,
      visibleColumns,
      columnWidths,
      RecordView,
      RecordForm,
      renderHeaders,
      actionMenuItems,
    } = this.props;
    const { showRestoreModal } = this.state;

    const urlQuery = queryString.parse(search);
    const searchTerm = trimSearchTerm(urlQuery.query);
    const actionMenu = isEmpty(actionMenuItems) ? null : this.renderActionMenu;
    const rowUpdater = selectedRecords ? this.rowUpdater : undefined;

    return (
      <IntlConsumer>
        {intl => (
          <ViewContainer
            entityKey={ENTITY_KEY}
            mutator={mutator}
            location={location}
            history={history}
            match={match}
            selectRecord={selectRecord}
            selectedRecords={selectedRecords}
          >
            {props => (
              <Fragment>
                <SearchAndSort
                  objectName={objectName}
                  finishedResourceName={ENTITY_KEY}
                  parentResources={resources}
                  parentMutator={mutator}
                  initialResultCount={INITIAL_RESULT_COUNT}
                  resultCountIncrement={RESULT_COUNT_INCREMENT}
                  searchLabelKey={`ui-data-import.settings.${ENTITY_KEY}.title`}
                  resultCountMessageKey={`ui-data-import.settings.${ENTITY_KEY}.count`}
                  resultsLabel={label}
                  defaultSort="name"
                  actionMenu={actionMenu}
                  visibleColumns={visibleColumns}
                  columnWidths={columnWidths}
                  columnMapping={renderHeaders()}
                  resultsFormatter={listTemplate({
                    intl,
                    entityKey: ENTITY_KEY,
                    searchTerm,
                    selectRecord,
                    selectedRecords,
                  })}
                  withNewRecordButton={withNewRecordButton}
                  ViewRecordComponent={RecordView}
                  EditRecordComponent={RecordForm}
                  detailProps={detailProps}
                  newRecordInitialValues={initialValues}
                  editRecordInitialValues={selectedRecord.record}
                  editRecordInitialValuesAreLoaded={selectedRecord.hasLoaded}
                  showSingleResult={showSingleResult}
                  onSubmitSearch={deselectAll}
                  rowUpdater={rowUpdater}
                  {...props}
                />
                <ConfirmationModal
                  id="restore-default-records-modal"
                  open={showRestoreModal}
                  heading={<FormattedMessage id="ui-data-import.modal.fileExtensions.reset.header" />}
                  message={<FormattedMessage id="ui-data-import.modal.fileExtensions.reset.message" />}
                  confirmLabel={<FormattedMessage id="ui-data-import.modal.fileExtensions.reset.actionButton" />}
                  cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
                  onConfirm={this.restoreDefaults}
                  onCancel={this.handleHideRestoreModal}
                />
                <Callout ref={this.calloutRef} />
              </Fragment>
            )}
          </ViewContainer>
        )}
      </IntlConsumer>
    );
  }
}
