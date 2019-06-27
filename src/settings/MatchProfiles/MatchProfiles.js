import React, {
  Component,
  createRef,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import queryString from 'query-string';
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
  trimSearchTerm,
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import { ENTITY_KEYS } from '../../utils/constants';
import {
  ActionMenu,
  SearchAndSort,
  MatchProfilesForm,
  listTemplate,
} from '../../components';
import { ViewMatchProfile } from './ViewMatchProfile';
import {
  createDeleteCallout,
  createUpdateRecordErrorMessage,
  SettingPage,
} from '../SettingPage';
import { ExceptionModal } from './ExceptionModal';

import sharedCss from '../../shared.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const finishedResourceName = 'matchProfiles';
const queryTemplate = `(
  name="%{query.query}*" OR
  existingRecordType="%{query.query}*" OR
  field="%{query.query}*" OR
  fieldMarc="%{query.query}*" OR
  fieldNonMarc="%{query.query}*" OR
  existingStaticValueType="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_match_profile', {});
  const selectedMatchProfile = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedMatchProfile };
};

@withCheckboxList
@stripesConnect
@connect(mapStateToProps)
export class MatchProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    matchProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'matchProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/matchProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            queryTemplate,
            {
              name: 'name',
              match: 'existingRecordType field fieldMarc fieldNonMarc existingStaticValueType',
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
      matchProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedMatchProfile: PropTypes.object.isRequired,
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

  calloutRef = createRef();

  entityKey = ENTITY_KEYS.MATCH_PROFILES;

  actionMenuItems = [
    'addNew',
    'exportSelected',
    'selectAll',
    'deselectAll',
  ];

  visibleColumns = [
    'selected',
    'name',
    'match',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    selected: 40,
    name: 200,
    match: 350,
    tags: 150,
    updated: 150,
    updatedBy: 250,
  };

  defaultNewRecordInitialValues = {
    name: '',
    description: '',
    /* TODO: these values are hardcoded now and will need to be changed in future (https://issues.folio.org/browse/UIDATIMP-175) */
    incomingRecordType: 'MARC',
    existingRecordType: 'HOLDINGS',
    incomingDataValueType: 'STATIC_VALUE',
  };

  get matchProfiles() {
    return get(this.props.resources, ['matchProfiles', 'records'], []);
  }

  setList() {
    const { setList } = this.props;

    setList(this.matchProfiles);
  }

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  getDeleteRecordSuccessfulMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.matchProfiles.action.success"
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
        id="ui-data-import.settings.matchProfiles.action.error"
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
    const { checkboxList: { selectRecord } } = this.props;

    this.onDeleteSuccessCallout(record);
    selectRecord(record.id);
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

  render() {
    const {
      resources,
      mutator,
      location,
      location: { search },
      history,
      match,
      label,
      showSingleResult,
      selectedMatchProfile,
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
                  objectName="match-profiles"
                  finishedResourceName={finishedResourceName}
                  parentResources={resources}
                  parentMutator={mutator}
                  initialResultCount={INITIAL_RESULT_COUNT}
                  resultCountIncrement={RESULT_COUNT_INCREMENT}
                  searchLabelKey="ui-data-import.settings.matchProfiles.title"
                  resultCountMessageKey="ui-data-import.settings.matchProfiles.count"
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
                    match: intl.formatMessage({ id: 'ui-data-import.match' }),
                    tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                    updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                    updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                  }}
                  columnWidths={this.columnWidths}
                  ViewRecordComponent={ViewMatchProfile}
                  EditRecordComponent={MatchProfilesForm}
                  newRecordInitialValues={this.defaultNewRecordInitialValues}
                  editRecordInitialValues={selectedMatchProfile.record}
                  editRecordInitialValuesAreLoaded={selectedMatchProfile.hasLoaded}
                  showSingleResult={showSingleResult}
                  onSubmitSearch={deselectAll}
                  {...props}
                />
                <ExceptionModal
                  id="delete-match-profile-exception-modal"
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
