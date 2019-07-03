import React, {
  Component,
  Fragment,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import {
  get,
  noop,
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
} from '../../components';
import { ViewActionProfile } from './ViewActionProfile';
import {
  SettingPage,
  createUpdateRecordErrorMessage,
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

  getRecordName(record) {
    return record.name;
  }

  onUpdateRecordError = createUpdateRecordErrorMessage({
    getRecordName: this.getRecordName,
    calloutRef: this.calloutRef,
  });

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
        handleSelectAllCheckbox,
      },
    } = this.props;

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
            onDeleteSuccess={noop}
            onDeleteError={noop}
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
                  {...props}
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
