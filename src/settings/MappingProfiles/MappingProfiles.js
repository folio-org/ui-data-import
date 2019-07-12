import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  get,
  noop,
} from 'lodash';

import {
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import { Checkbox } from '@folio/stripes/components';

import {
  listTemplate,
  SearchAndSort,
} from '../../components';
import { ViewMappingProfile } from './ViewMappingProfile';
import { SettingPage } from '../SettingPage';
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
const finishedResourceName = 'mappingProfiles';
const queryTemplate = `(
  name="%{query.query}*" OR
  mapped="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;

@withCheckboxList
@stripesConnect
export class MappingProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    mappingProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'mappingProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/mappingProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            queryTemplate,
            {
              name: 'name',
              mapped: 'mapped',
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
      mappingProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
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

    setList(this.mappingProfiles);
  }

  entityKey = ENTITY_KEYS.MAPPING_PROFILES;

  visibleColumns = [
    'selected',
    'name',
    'mapped',
    'tags',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    selected: 40,
    name: 200,
    mapped: 100,
    tags: 150,
    updated: 150,
    updatedBy: 250,
  };

  get mappingProfiles() {
    return get(this.props, ['resources', 'mappingProfiles', 'records'], []);
  }

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
            onUpdateRecordError={noop}
            onDeleteSuccess={noop}
            onDeleteError={noop}
          >
            {props => (
              <Fragment>
                <SearchAndSort
                  objectName="mapping-profiles"
                  finishedResourceName={finishedResourceName}
                  parentResources={resources}
                  parentMutator={mutator}
                  initialResultCount={INITIAL_RESULT_COUNT}
                  resultCountIncrement={RESULT_COUNT_INCREMENT}
                  searchLabelKey="ui-data-import.settings.mappingProfiles.title"
                  resultCountMessageKey="ui-data-import.settings.mappingProfiles.count"
                  resultsLabel={label}
                  defaultSort="name"
                  actionMenu={noop}
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
                    mapped: intl.formatMessage({ id: 'ui-data-import.mapped' }),
                    tags: intl.formatMessage({ id: 'ui-data-import.tags' }),
                    updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                    updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                  }}
                  columnWidths={this.columnWidths}
                  ViewRecordComponent={ViewMappingProfile}
                  showSingleResult={showSingleResult}
                  {...props}
                />
              </Fragment>
            )}
          </SettingPage>
        )}
      </IntlConsumer>
    );
  }
}
