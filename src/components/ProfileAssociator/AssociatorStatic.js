import React, {
  Fragment,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import {
  omit,
  noop,
  without,
} from 'lodash';

import {
  SearchAndSortQuery,
  getNsKey,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import {
  SearchField,
  Button,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  useCheckboxList,
  compose,
  stringToWords,
} from '../../utils';
import {
  ENTITY_KEYS,
  SORT_TYPES,
} from '../../utils/constants';
import { associatedProfilesColumns } from './associatedProfilesColumns';

import searchAndSortCss from '../SearchAndSort/SearchAndSort.css';

import { jobProfilesShape } from '../../settings/JobProfiles';
import { matchProfilesShape } from '../../settings/MatchProfiles';
import { actionProfilesShape } from '../../settings/ActionProfiles';
import { mappingProfilesShape } from '../../settings/MappingProfiles';

const profiles = {
  [ENTITY_KEYS.JOB_PROFILES]: jobProfilesShape,
  [ENTITY_KEYS.MATCH_PROFILES]: matchProfilesShape,
  [ENTITY_KEYS.ACTION_PROFILES]: actionProfilesShape,
  [ENTITY_KEYS.MAPPING_PROFILES]: mappingProfilesShape,
};

const columnWidths = { selected: 40 };

const AssociatorStaticComponent = ({
  entityKey,
  namespaceKey,
  isMultiSelect,
  mutator,
  query,
  dataAttributes,
  contentData,
  hasLoaded,
  history,
}) => {
  const nsSort = getNsKey('sort', namespaceKey);
  const nsQuery = getNsKey('query', namespaceKey);
  const initialQuery = {
    [nsSort]: 'name',
    [nsQuery]: '',
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void mutator.query.update(initialQuery), []);

  const checkboxList = useCheckboxList(contentData);
  const {
    selectedRecords,
    selectRecord,
    deselectAll,
  } = checkboxList;

  const {
    [nsSort]: sortOrderQuery = initialQuery[nsSort],
    [nsQuery]: searchTerm = initialQuery[nsQuery],
  } = query;

  const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
  const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');

  const querySetter = ({ nsValues }) => mutator.query.update(nsValues);
  const queryGetter = () => query;
  const rowUpdater = ({ id }) => selectedRecords.has(id);

  const columnTemplates = associatedProfilesColumns({
    entityKey,
    searchTerm,
    selectRecord,
    selectedRecords,
    isMultiSelect,
  });
  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');
  const dataAttrs = dataAttributes || { [`data-test-associated-${entityName}`]: true };

  const navigateTo = ({ id }) => {
    history.push(`/settings/data-import/${entityName}/view/${id}`);
  };

  const RenderSearch = ({
    searchValue,
    resetAll,
    getSearchHandlers,
    onSubmitSearch,
  }) => {
    const onSubmit = event => {
      onSubmitSearch(event);
      deselectAll();
    };

    return (
      <form onSubmit={onSubmit}>
        <div className={searchAndSortCss.searchWrap}>
          <div className={searchAndSortCss.searchFiledWrap}>
            <SearchField
              id={`input-associated-${entityName}-search`}
              clearSearchId={`input-associated-${entityName}-clear-search-button`}
              loading={!hasLoaded}
              aria-label={`associated ${entityName} search`}
              marginBottom0
              name="query"
              value={searchValue.query}
              onChange={getSearchHandlers().query}
              onClear={resetAll}
            />
          </div>
          <div className={searchAndSortCss.searchButtonWrap}>
            <Button
              data-test-search-and-sort-submit
              disabled={!searchValue.query}
              type="submit"
              buttonStyle="primary"
              fullWidth
              marginBottom0
            >
              <FormattedMessage id="stripes-smart-components.search" />
            </Button>
          </div>
        </div>
      </form>
    );
  };

  const RenderTable = ({ onSort }) => {
    const {
      visibleColumns,
      renderHeaders,
    } = profiles[entityKey];

    const headers = omit(renderHeaders({ checkboxList }), 'description');

    const cols = without(visibleColumns, 'description');
    const columns = isMultiSelect ? ['selected', ...cols] : cols;

    return (
      <MultiColumnList
        id={`associated-${entityKey}-list`}
        visibleColumns={columns}
        columnWidths={columnWidths}
        columnMapping={headers}
        contentData={contentData}
        formatter={columnTemplates}
        rowUpdater={rowUpdater}
        sortOrder={sortOrder}
        sortDirection={sortDirection}
        onHeaderClick={onSort}
        onRowClick={navigateTo}
      />
    );
  };

  if (isMultiSelect) {
    return (
      <div {...dataAttrs}>
        <SearchAndSortQuery
          querySetter={querySetter}
          queryGetter={queryGetter}
          syncToLocationSearch={false}
          searchChangeCallback={deselectAll}
          nsParams={namespaceKey}
          initialSearchState={initialQuery}
        >
          {({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            resetAll,
          }) => (
            <Fragment>
              <RenderSearch
                onSubmitSearch={onSubmitSearch}
                searchValue={searchValue}
                resetAll={resetAll}
                getSearchHandlers={getSearchHandlers}
              />
              <RenderTable onSort={onSort} />
            </Fragment>
          )}
        </SearchAndSortQuery>
      </div>
    );
  }

  return (
    <div {...dataAttrs}>
      <RenderTable onSort={noop} />
    </div>
  );
};

AssociatorStaticComponent.propTypes = {
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  isMultiSelect: PropTypes.bool,
  mutator: PropTypes.shape({ query: PropTypes.object.isRequired }).isRequired,
  query: PropTypes.object.isRequired,
  dataAttributes: PropTypes.shape(PropTypes.object),
  contentData: PropTypes.arrayOf(PropTypes.object),
  hasLoaded: PropTypes.bool,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
};

AssociatorStaticComponent.defaultProps = {
  isMultiSelect: true,
  dataAttributes: null,
  contentData: null,
  hasLoaded: false,
};

export const AssociatorStatic = compose(
  withRouter, // is needed for manifest props interpolation
  stripesConnect,
)(AssociatorStaticComponent);
