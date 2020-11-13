import React, {
  memo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  SearchField,
  Button,
} from '@folio/stripes/components';

import {
  useCheckboxList,
  stringToWords,
} from '../../utils';
import { searchAndSortTemplate } from '../ListTemplate';

import { AssociatedList } from './AssociatedList';

import searchAndSortCss from '../SearchAndSort/SearchAndSort.css';

export const AssociatorStatic = memo(({
  intl,
  entityKey,
  namespaceKey,
  isMultiSelect,
  profileShape,
  dataAttributes,
  contentData,
  hasLoaded,
  useSearch,
}) => {
  const [currentData, setCurrentData] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const checkboxList = useCheckboxList(contentData);

  const columnWidths = { selected: '40px' };
  const searchTemplate = searchAndSortTemplate(intl);

  const { deselectAll } = checkboxList;
  const { visibleColumns } = profileShape;

  const descIdx = visibleColumns.indexOf('description');
  let filterColumns = visibleColumns;

  if (descIdx >= 0) {
    filterColumns = visibleColumns.splice(descIdx, 1);
  }
  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');
  const dataAttrs = dataAttributes || { [`data-test-associated-${entityName}`]: true };

  useEffect(() => {
    setCurrentData(contentData);
  }, [contentData]);

  useEffect(() => {
    const newData = currentData.filter(item => {
      for (let i = 0; i < filterColumns.length; i++) {
        const col = filterColumns[i];
        const currentDataItemValue = searchTemplate[col](item).toLowerCase();
        const searchQuery = currentQuery.toLowerCase();

        if (currentDataItemValue.includes(searchQuery)) {
          return true;
        }
      }

      return false;
    });

    setCurrentData(newData);
  }, [currentQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const querySetter = () => {};

  const queryGetter = () => {};

  const RenderSearch = ({
    searchValue,
    resetAll,
    getSearchHandlers,
    onSubmitSearch,
  }) => {
    const onSubmit = event => {
      event.preventDefault();
      setCurrentQuery(searchValue.query);
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
              onClear={() => {
                setCurrentData(contentData);
                resetAll();
              }}
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

  RenderSearch.propTypes = {
    searchValue: PropTypes.object.isRequired || PropTypes.string.isRequired,
    resetAll: PropTypes.func.isRequired,
    getSearchHandlers: PropTypes.func.isRequired,
    onSubmitSearch: PropTypes.func.isRequired,
  };

  if (isMultiSelect || useSearch) {
    return (
      <div {...dataAttrs}>
        <SearchAndSortQuery
          querySetter={queryGetter}
          queryGetter={querySetter}
          syncToLocationSearch={false}
          searchChangeCallback={deselectAll}
          nsParams={namespaceKey}
          initialSearchState={{ query: '' }}
        >
          {({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            resetAll,
          }) => (
            <>
              <RenderSearch
                onSubmitSearch={onSubmitSearch}
                searchValue={searchValue}
                resetAll={resetAll}
                getSearchHandlers={getSearchHandlers}
              />
              <AssociatedList
                intl={intl}
                entityKey={entityKey}
                namespaceKey={namespaceKey}
                checkboxList={checkboxList}
                columnWidths={columnWidths}
                profileShape={profileShape}
                contentData={currentData}
                onSort={onSort}
                isStatic
                isMultiSelect={isMultiSelect}
              />
            </>
          )}
        </SearchAndSortQuery>
      </div>
    );
  }

  return (
    <div {...dataAttrs}>
      <AssociatedList
        intl={intl}
        entityKey={entityKey}
        namespaceKey={namespaceKey}
        checkboxList={checkboxList}
        columnWidths={columnWidths}
        profileShape={profileShape}
        contentData={currentData}
        onSort={noop}
        isMultiSelect={isMultiSelect}
      />
    </div>
  );
});

AssociatorStatic.propTypes = {
  intl: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  profileShape: PropTypes.object.isRequired,
  isMultiSelect: PropTypes.bool,
  dataAttributes: PropTypes.shape(PropTypes.object),
  contentData: PropTypes.arrayOf(PropTypes.object),
  hasLoaded: PropTypes.bool,
  useSearch: PropTypes.bool,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
};

AssociatorStatic.defaultProps = {
  isMultiSelect: true,
  dataAttributes: null,
  contentData: null,
  hasLoaded: false,
  useSearch: true,
};
