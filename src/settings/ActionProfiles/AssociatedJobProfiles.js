import React, {
  Fragment,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  makeQueryFunction,
  SearchAndSortQuery,
  getNsKey,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import {
  SearchField,
  Button,
  MultiColumnList,
  Checkbox,
} from '@folio/stripes/components';

import {
  useCheckboxList,
  compose,
} from '../../utils';
import {
  PROFILE_TYPES,
  SORT_TYPES,
} from '../../utils/constants';
import { createAssociatedJobProfilesFormatter } from '../../components';

import searchAndSortCss from '../../components/SearchAndSort/SearchAndSort.css';
import sharedCss from '../../shared.css';

const associatedJobProfilesNsParams = 'AJP';
const nsSort = getNsKey('sort', associatedJobProfilesNsParams);
const nsQuery = getNsKey('query', associatedJobProfilesNsParams);
const initialQuery = {
  [nsSort]: 'name',
  [nsQuery]: '',
};
const associatedJobProfilesVisibleColumns = [
  'selected',
  'name',
  'tags',
  'updated',
  'updatedBy',
];
const columnWidths = { selected: 40 };

const AssociatedJobProfilesComponent = ({
  resources,
  mutator,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void mutator.query.update(initialQuery), []);

  const associatedJobProfilesResource = get(resources, 'associatedJobProfiles', {}) || {};
  const associatedJobProfiles = get(
    associatedJobProfilesResource,
    ['records', 0, 'childSnapshotWrappers'],
    []
  ).map(({ content }) => content);

  const {
    selectedRecords,
    isAllSelected,
    selectRecord,
    deselectAll,
    handleSelectAllCheckbox,
  } = useCheckboxList(associatedJobProfiles);

  const {
    [nsSort]: sortOrderQuery = initialQuery[nsSort],
    [nsQuery]: searchTerm = initialQuery[nsQuery],
  } = resources.query;

  const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
  const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');

  const querySetter = ({ nsValues }) => mutator.query.update(nsValues);
  const queryGetter = () => resources.query;

  const associatedJobProfilesFormatter = createAssociatedJobProfilesFormatter({
    searchTerm,
    selectRecord,
    selectedRecords,
  });

  return (
    <div data-test-associated-job-profiles>
      <SearchAndSortQuery
        querySetter={querySetter}
        queryGetter={queryGetter}
        syncToLocationSearch={false}
        searchChangeCallback={deselectAll}
        nsParams={associatedJobProfilesNsParams}
        initialSearchState={initialQuery}
      >
        {({
          searchValue,
          getSearchHandlers,
          onSubmitSearch,
          onSort,
          resetAll,
        }) => {
          const onSubmit = event => {
            onSubmitSearch(event);
            deselectAll();
          };
          const searchButtonDisabled = !searchValue.query;

          return (
            <Fragment>
              <form onSubmit={onSubmit}>
                <div className={searchAndSortCss.searchWrap}>
                  <div className={searchAndSortCss.searchFiledWrap}>
                    <SearchField
                      id="input-associated-job-profiles-search"
                      clearSearchId="input-associated-job-profiles-clear-search-button"
                      loading={!associatedJobProfilesResource.hasLoaded}
                      aria-label="associated job profiles search"
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
                      disabled={searchButtonDisabled}
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
              <MultiColumnList
                id="associated-job-profiles-list"
                visibleColumns={associatedJobProfilesVisibleColumns}
                contentData={associatedJobProfiles}
                columnMapping={{
                  selected: (
                    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
                      role="button"
                      tabIndex="0"
                      className={sharedCss.selectableCellButton}
                      data-test-select-all-associated-job-profiles-checkbox
                      onClick={e => e.stopPropagation()}
                    >
                      <Checkbox
                        name="selected-all"
                        checked={isAllSelected}
                        onChange={handleSelectAllCheckbox}
                      />
                    </div>
                  ),
                  name: <FormattedMessage id="ui-data-import.name" />,
                  tags: <FormattedMessage id="ui-data-import.tags" />,
                  updated: <FormattedMessage id="ui-data-import.updated" />,
                  updatedBy: <FormattedMessage id="ui-data-import.updatedBy" />,
                }}
                columnWidths={columnWidths}
                formatter={associatedJobProfilesFormatter}
                sortOrder={sortOrder}
                sortDirection={sortDirection}
                onHeaderClick={onSort}
              />
            </Fragment>
          );
        }}
      </SearchAndSortQuery>
    </div>
  );
};

AssociatedJobProfilesComponent.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: initialQuery },
  associatedJobProfiles: {
    type: 'okapi',
    path: 'data-import-profiles/profileAssociations/:{id}/masters',
    throwErrors: false,
    GET: {
      params: {
        detailType: PROFILE_TYPES.ACTION_PROFILE,
        masterType: PROFILE_TYPES.JOB_PROFILE,
        query: makeQueryFunction(
          'cql.allRecords=1',
          '(name="%{query.query}*" OR tags.tagList="%{query.query}*")',
          {
            name: 'name',
            tags: 'tags.tagList',
            updated: 'metadata.updatedDate',
            updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
          },
          [],
          0,
          associatedJobProfilesNsParams,
        ),
      },
      staticFallback: { params: {} },
    },
  },
});

AssociatedJobProfilesComponent.propTypes = {
  resources: PropTypes.shape({
    query: PropTypes.object.isRequired,
    associatedJobProfiles: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  mutator: PropTypes.shape({ query: PropTypes.object.isRequired }).isRequired,
};

export const AssociatedJobProfiles = compose(
  withRouter, // is needed for manifest props interpolation
  stripesConnect,
)(AssociatedJobProfilesComponent);
