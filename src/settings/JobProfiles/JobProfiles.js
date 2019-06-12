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
  listTemplate,
  JobProfilesForm,
  SearchAndSort,
} from '../../components';
import { ViewJobProfile } from './ViewJobProfile';
import {
  createDeleteCallout,
  createUpdateRecordErrorMessage,
  SettingPage,
} from '../SettingPage';
import {
  trimSearchTerm,
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import { ENTITY_CONFIGS } from '../../utils/constants';

import sharedCss from '../../shared.css';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;
const finishedResourceName = 'jobProfiles';

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_job_profile', {});
  const selectedJobProfile = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedJobProfile };
};

@withCheckboxList
@connect(mapStateToProps)
@stripesConnect
export class JobProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    jobProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'jobProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/jobProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(name="%{query.query}*" OR tags.tagList="%{query.query}*")',
            {
              name: 'name',
              updated: 'metadata.updatedDate',
              tags: 'tags.tagList',
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
      jobProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedJobProfile: PropTypes.object.isRequired,
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

  calloutRef = createRef();

  setList() {
    const { setList } = this.props;

    setList(this.jobProfiles);
  }

  entityKey = ENTITY_CONFIGS.JOB_PROFILES.ENTITY_KEY;

  actionMenuItems = [
    'addNew',
    'exportSelected',
    'selectAll',
    'deselectAll',
  ];

  visibleColumns = [
    'selected',
    'name',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    selected: 40,
    name: 200,
    tags: 150,
    updated: 150,
    updatedBy: 250,
  };

  defaultNewRecordInitialValues = {
    name: '',
    description: '',
    dataType: '',
  };

  getDeleteRecordSuccessfulMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.jobProfiles.action.success"
        values={{
          name: record.name,
          action: (
            <FormattedMessage
              tagName="strong"
              id="ui-data-import.deleted"
            />
          ),
        }}
      />
    );
  }

  getDeleteRecordErrorMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.jobProfiles.action.error"
        values={{
          name: record.name,
          action: (
            <FormattedMessage
              tagName="strong"
              id="ui-data-import.deleted"
            />
          ),
        }}
      />
    );
  }

  getRecordName(record) {
    return record.name;
  }

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  get jobProfiles() {
    return get(this.props.resources, ['jobProfiles', 'records'], []);
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

  onDeleteError = createDeleteCallout({
    getMessage: this.getDeleteRecordErrorMessage,
    calloutRef: this.calloutRef,
    type: 'error',
  });

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
      selectedJobProfile,
      checkboxList: {
        selectedRecords,
        isAllSelected,
        selectRecord,
        deselectAll,
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
            onDeleteSuccess={this.onDeleteSuccess}
            onDeleteError={this.onDeleteError}
          >
            {props => (
              <Fragment>
                <SearchAndSort
                  objectName="job-profiles"
                  finishedResourceName={finishedResourceName}
                  parentResources={resources}
                  parentMutator={mutator}
                  initialResultCount={INITIAL_RESULT_COUNT}
                  resultCountIncrement={RESULT_COUNT_INCREMENT}
                  searchLabelKey="ui-data-import.settings.jobProfiles.title"
                  resultCountMessageKey="ui-data-import.settings.jobProfiles.count"
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
                    tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                    updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                    updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                  }}
                  columnWidths={this.columnWidths}
                  ViewRecordComponent={ViewJobProfile}
                  EditRecordComponent={JobProfilesForm}
                  newRecordInitialValues={this.defaultNewRecordInitialValues}
                  editRecordInitialValues={selectedJobProfile.record}
                  editRecordInitialValuesAreLoaded={selectedJobProfile.hasLoaded}
                  showSingleResult={showSingleResult}
                  onSubmitSearch={deselectAll}
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
