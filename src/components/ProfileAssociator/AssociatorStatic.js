import React, {
  memo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import { SearchForm } from '@folio/stripes-data-transfer-components';

import {
  useCheckboxList,
  stringToWords,
} from '../../utils';
import { searchAndSortTemplate } from '../ListTemplate';

import { AssociatedList } from './AssociatedList';

const FILTER_COLUMNS = ['name', 'tags'];

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

  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');
  const dataAttrs = dataAttributes || { [`data-test-associated-${entityName}`]: true };

  useEffect(() => {
    setCurrentData(contentData);
  }, [contentData]);

  useEffect(() => {
    const newData = currentData.filter(item => {
      for (let i = 0; i < FILTER_COLUMNS.length; i++) {
        const column = FILTER_COLUMNS[i];
        const currentDataItemValue = searchTemplate[column](item).toLowerCase();
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
    const searchTerm = searchValue.query;
    const onChangeSearch = getSearchHandlers().query;

    const onSubmit = event => {
      event.preventDefault();
      setCurrentQuery(searchTerm);
      onSubmitSearch(event);
      deselectAll();
    };
    const onClearSearch = () => {
      setCurrentQuery('');
      setCurrentData(contentData);
      resetAll();
    };

    return (
      <SearchForm
        searchLabelKey={`ui-data-import.settings.${entityKey}.title`}
        searchTerm={searchTerm}
        isLoading={!hasLoaded}
        handleChange={onChangeSearch}
        handleClear={onClearSearch}
        handleSubmit={onSubmit}
        fieldName="query"
        idKey={entityKey}
      />
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
                searchTerm={currentQuery}
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
