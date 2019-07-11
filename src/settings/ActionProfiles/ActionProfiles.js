import React, {
  Component,
  Fragment,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  get,
  omit,
} from 'lodash';

import {
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import {
  Checkbox,
  Callout,
} from '@folio/stripes/components';

import {
  ActionMenu,
  ActionProfilesForm,
  listTemplate,
  SearchAndSort,
  ExceptionModal,
} from '../../components';
import { ViewActionProfile } from './ViewActionProfile';
import {
  SettingPage,
  createUpdateRecordErrorMessage,
  createDeleteCallout,
  deselectOnDelete,
} from '../SettingPage';
import {
  trimSearchTerm,
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import { ENTITY_KEYS } from '../../utils/constants';

import sharedCss from '../../shared.css';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;
const finishedResourceName = 'actionProfiles';
const queryTemplate = `(
  name="%{query.query}*" OR
  action="%{query.query}*" OR
  folioRecord="%{query.query}*" OR
  mapping="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_action_profile', {});
  const selectedActionProfile = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedActionProfile };
};

@withCheckboxList
@stripesConnect
@connect(mapStateToProps)
export class ActionProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    actionProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'actionProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/actionProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            queryTemplate,
            {
              name: 'name',
              action: 'action folioRecord',
              mapping: 'mapping',
              tags: 'tags.tagList',
              updated: 'metadata.updatedDate',
              updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
            },
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      actionProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedActionProfile: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

  state = { showExceptionModal: false };

  componentDidMount() {
    this.setList();
  }

  componentDidUpdate(prevProps) {
    const { resources } = this.props;

    if (prevProps.resources !== resources) {
      this.setList();
    }
  }

  setList() {
    const { setList } = this.props;

    setList(this.actionProfiles);
  }

  entityKey = ENTITY_KEYS.ACTION_PROFILES;

  actionMenuItems = [
    'addNew',
    'exportSelected',
    'selectAll',
    'deselectAll',
  ];

  visibleColumns = [
    'selected',
    'name',
    'action',
    'mapping',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    selected: 40,
    name: 200,
    action: 200,
    mapping: 150,
    tags: 150,
    updated: 150,
    updatedBy: 250,
  };

  calloutRef = createRef();

  getDeleteRecordSuccessfulMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.actionProfiles.action.success"
        values={{
          name: record.name,
          action: (
            <FormattedMessage
              id="ui-data-import.deleted"
              tagName="strong"
            />
          ),
        }}
      />
    );
  }

  getDeleteRecordErrorMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.actionProfiles.action.error"
        values={{
          name: record.name,
          action: (
            <FormattedMessage
              id="ui-data-import.deleted"
              tagName="strong"
            />
          ),
        }}
      />
    );
  }

  getRecordName(record) {
    return record.name;
  }

  onUpdateRecordError = createUpdateRecordErrorMessage({
    getRecordName: this.getRecordName,
    calloutRef: this.calloutRef,
  });

  onDeleteSuccessCallout = createDeleteCallout({
    getMessage: this.getDeleteRecordSuccessfulMessage,
    calloutRef: this.calloutRef,
  });

  onDeleteSuccess = record => {
    const {
      checkboxList: {
        selectRecord,
        selectedRecords,
      },
    } = this.props;

    this.onDeleteSuccessCallout(record);
    deselectOnDelete({
      recordId: record.id,
      selectRecord,
      selectedRecords,
    });
  };

  onDeleteErrorCallout = createDeleteCallout({
    getMessage: this.getDeleteRecordErrorMessage,
    calloutRef: this.calloutRef,
    type: 'error',
  });

  onDeleteError = (record, error) => {
    if (error.status === 409) {
      this.setState({ showExceptionModal: true });

      return;
    }

    this.onDeleteErrorCallout(record);
  };

  handleCloseExceptionModal = () => this.setState({ showExceptionModal: false });

  defaultNewRecordInitialValues = {
    name: '',
    description: '',
    // TODO: remove hardcoded `folioRecord` and `action` fields
    // when https://issues.folio.org/browse/UIDATIMP-207 is done
    folioRecord: 'MARC_BIBLIOGRAPHIC',
    action: 'CREATE',
  };

  get actionProfiles() {
    return get(this.props, ['resources', 'actionProfiles', 'records'], []);
  }

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  render() {
    const {
      resources,
      mutator,
      label,
      location,
      location: { search },
      history,
      match,
      showSingleResult,
      selectedActionProfile,
      checkboxList: {
        selectedRecords,
        isAllSelected,
        selectRecord,
        deselectAll,
        handleSelectAllCheckbox,
      },
    } = this.props;
    const { showExceptionModal } = this.state;

    const urlQuery = queryString.parse(search);
    const searchTerm = trimSearchTerm(urlQuery.query);

    return (
      <IntlConsumer>
        {intl => (
          <SettingPage
            finishedResourceName={finishedResourceName}
            mutator={mutator}
            location={location}
            history={history}
            match={match}
            onUpdateRecordError={this.onUpdateRecordError}
            onDeleteSuccess={this.onDeleteSuccess}
            onDeleteError={this.onDeleteError}
          >
            {props => (
              <Fragment>
                <SearchAndSort
                  objectName="action-profiles"
                  finishedResourceName={finishedResourceName}
                  parentResources={resources}
                  parentMutator={mutator}
                  initialResultCount={INITIAL_RESULT_COUNT}
                  resultCountIncrement={RESULT_COUNT_INCREMENT}
                  searchLabelKey="ui-data-import.settings.actionProfiles.title"
                  resultCountMessageKey="ui-data-import.settings.actionProfiles.count"
                  resultsLabel={label}
                  defaultSort="name"
                  actionMenu={this.renderActionMenu}
                  resultsFormatter={listTemplate({
                    entityKey: this.entityKey,
                    searchTerm,
                    selectRecord,
                    selectedRecords,
                  })}
                  visibleColumns={this.visibleColumns}
                  columnMapping={{
                    selected: (
                      <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                        role="button"
                        tabIndex="0"
                        className={sharedCss.selectableCellButton}
                        data-test-select-all-checkbox
                        onClick={e => e.stopPropagation()}
                      >
                        <Checkbox
                          name="selected-all"
                          checked={isAllSelected}
                          onChange={handleSelectAllCheckbox}
                        />
                      </div>
                    ),
                    name: intl.formatMessage({ id: 'ui-data-import.name' }),
                    action: intl.formatMessage({ id: 'ui-data-import.action' }),
                    mapping: intl.formatMessage({ id: 'ui-data-import.mapping' }),
                    tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                    updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                    updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                  }}
                  columnWidths={this.columnWidths}
                  ViewRecordComponent={ViewActionProfile}
                  EditRecordComponent={ActionProfilesForm}
                  newRecordInitialValues={this.defaultNewRecordInitialValues}
                  editRecordInitialValues={selectedActionProfile.record}
                  editRecordInitialValuesAreLoaded={selectedActionProfile.hasLoaded}
                  showSingleResult={showSingleResult}
                  onSubmitSearch={deselectAll}
                  {...props}
                />
                <ExceptionModal
                  id="delete-action-profile-exception-modal"
                  label={<FormattedMessage id="ui-data-import.settings.actionProfiles.exceptionModal.label" />}
                  message={<FormattedMessage id="ui-data-import.settings.actionProfiles.exceptionModal.message" />}
                  showExceptionModal={showExceptionModal}
                  onClose={this.handleCloseExceptionModal}
                />
                <Callout ref={this.calloutRef} />
              </Fragment>
            )}
          </SettingPage>
        )}
      </IntlConsumer>
    );
  }
}
