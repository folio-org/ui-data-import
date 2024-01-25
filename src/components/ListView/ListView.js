import React, {
  Component,
  createRef,
} from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  get,
  isEmpty,
} from 'lodash';

import {
  Callout,
  ConfirmationModal,
} from '@folio/stripes/components';
import { buildUrl } from '@folio/stripes/smart-components';
import {
  TitleManager,
  stripesShape,
} from '@folio/stripes/core';
import { listTemplate } from '@folio/stripes-data-transfer-components';

import {
  checkboxListShape,
  trimSearchTerm,
  showActionMenu,
  fieldsConfig,
} from '../../utils';
import {
  ViewContainer,
  getCRUDActions,
} from '../ViewContainer';
import { SearchAndSort } from '../SearchAndSort';
import { ActionMenu } from '../ActionMenu';
import { createNetworkMessage } from '../Callout';

@injectIntl
export class ListView extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    location: PropTypes.oneOfType([
      PropTypes.shape({
        search: PropTypes.string.isRequired,
        pathname: PropTypes.string.isRequired,
      }).isRequired,
      PropTypes.string.isRequired,
    ]),
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedRecord: PropTypes.object,
    checkboxList: checkboxListShape,
    setList: PropTypes.func.isRequired,
    showSingleResult: PropTypes.bool,
    objectName: PropTypes.string,
    ViewRecordComponent: PropTypes.func.isRequired,
    CreateRecordComponent: PropTypes.func,
    EditRecordComponent: PropTypes.func,
    INITIAL_RESULT_COUNT: PropTypes.number,
    RESULT_COUNT_INCREMENT: PropTypes.number,
    ENTITY_KEY: PropTypes.string,
    detailProps: PropTypes.object,
    withNewRecordButton: PropTypes.bool,
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    nonInteractiveHeaders: PropTypes.arrayOf(PropTypes.string),
    columnWidths: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    renderHeaders: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isFullScreen: PropTypes.bool,
    defaultSort: PropTypes.string,
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
    defaultSort: 'name',
    nonInteractiveHeaders: [],
    detailProps: { jsonSchemas: { identifierTypes: [] } },
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
    if (this.props.setList) {
      this.props.setList(this.entityList);
    }
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
      baseUrl={this.props.match.path}
    />
  );

  rowUpdater = ({ id }) => {
    const { checkboxList: { selectedRecords } } = this.props;

    return selectedRecords.has(id);
  };

  render() {
    const {
      stripes,
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
      ViewRecordComponent,
      CreateRecordComponent,
      EditRecordComponent,
      renderHeaders,
      actionMenuItems,
      isFullScreen,
      defaultSort,
      nonInteractiveHeaders,
      intl,
    } = this.props;
    const { showRestoreModal } = this.state;

    const urlQuery = queryString.parse(search);
    const searchTerm = trimSearchTerm(urlQuery.query);
    const actionMenu = isEmpty(actionMenuItems) ? null : this.renderActionMenu;
    const rowUpdater = selectedRecords ? this.rowUpdater : undefined;
    const identifierTypes = detailProps.jsonSchemas?.identifierTypes;

    return (
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
          <>
            <TitleManager
              page={intl.formatMessage({ id: 'ui-data-import.settings.dataImport.title' })}
              record={intl.formatMessage({ id: `ui-data-import.settings.${ENTITY_KEY}.title` })}
            />
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
              defaultSort={defaultSort}
              actionMenu={showActionMenu({
                renderer: actionMenu,
                stripes,
              })}
              visibleColumns={visibleColumns}
              columnWidths={columnWidths}
              columnMapping={renderHeaders()}
              resultsFormatter={listTemplate({
                entityKey: ENTITY_KEY,
                searchTerm,
                selectRecord,
                selectedRecords,
                identifierTypes,
                fieldsConfig,
              })}
              withNewRecordButton={withNewRecordButton}
              ViewRecordComponent={ViewRecordComponent}
              EditRecordComponent={EditRecordComponent}
              CreateRecordComponent={CreateRecordComponent}
              detailProps={detailProps}
              newRecordInitialValues={initialValues}
              editRecordInitialValues={selectedRecord.record}
              editRecordInitialValuesAreLoaded={selectedRecord.hasLoaded}
              showSingleResult={showSingleResult}
              onSubmitSearch={deselectAll}
              isFullScreen={isFullScreen}
              rowUpdater={rowUpdater}
              nonInteractiveHeaders={nonInteractiveHeaders}
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
          </>
        )}
      </ViewContainer>
    );
  }
}
