import React, { Fragment } from 'react';
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

import { AssociatedList } from './AssociatedList';

import searchAndSortCss from '../SearchAndSort/SearchAndSort.css';

export const AssociatorStatic = ({
  entityKey,
  namespaceKey,
  isMultiSelect,
  dataAttributes,
  contentData,
  hasLoaded,
  useSearch,
}) => {
  const columnWidths = { selected: 40 };
  const checkboxList = useCheckboxList(contentData);
  const { deselectAll } = checkboxList;

  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');
  const dataAttrs = dataAttributes || { [`data-test-associated-${entityName}`]: true };

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
          querySetter={noop}
          queryGetter={noop}
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
            <Fragment>
              <RenderSearch
                onSubmitSearch={onSubmitSearch}
                searchValue={searchValue}
                resetAll={resetAll}
                getSearchHandlers={getSearchHandlers}
              />
              <AssociatedList
                entityKey={entityKey}
                namespaceKey={namespaceKey}
                checkboxList={checkboxList}
                columnWidths={columnWidths}
                contentData={contentData}
                onSort={onSort}
                isStatic
                isMultiSelect={isMultiSelect}
              />
            </Fragment>
          )}
        </SearchAndSortQuery>
      </div>
    );
  }

  return (
    <div {...dataAttrs}>
      <AssociatedList
        entityKey={entityKey}
        namespaceKey={namespaceKey}
        checkboxList={checkboxList}
        columnWidths={columnWidths}
        contentData={contentData}
        onSort={noop}
        isMultiSelect={isMultiSelect}
      />
    </div>
  );
};

AssociatorStatic.propTypes = {
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
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
