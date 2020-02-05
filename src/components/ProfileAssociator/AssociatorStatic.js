import React, {
  Fragment,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import { IntlConsumer } from '@folio/stripes/core';
import { SearchAndSortQuery } from '@folio/stripes/smart-components';
import {
  SearchField,
  Button,
} from '@folio/stripes/components';

import {
  useCheckboxList,
  stringToWords,
  formatUserName,
} from '../../utils';

import { AssociatedList } from './AssociatedList';

import searchAndSortCss from '../SearchAndSort/SearchAndSort.css';

export const AssociatorStatic = ({
  entityKey,
  namespaceKey,
  isMultiSelect,
  profileShape,
  dataAttributes,
  contentData,
  hasLoaded,
  useSearch,
}) => {
  const [currentData, setCurrentData] = useState(contentData);
  const columnWidths = { selected: 40 };
  const checkboxList = useCheckboxList(contentData);
  const { deselectAll } = checkboxList;

  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');
  const dataAttrs = dataAttributes || { [`data-test-associated-${entityName}`]: true };

  const querySetter = () => {};

  const queryGetter = () => {};

  const RenderSearch = ({
    searchValue,
    resetAll,
    getSearchHandlers,
    onSubmitSearch,
  }) => {
    const { visibleColumns } = profileShape;

    const onSubmit = event => {
      event.preventDefault();

      const value = searchValue.query;
      const newData = contentData.filter(item => {
        for (let i = 0; i < visibleColumns.length; i++) {
          const col = visibleColumns[i];

          switch (col) {
            case 'tags':
            case 'dataTypes':
              if (item[col].tagList.join(', ').includes(value)) {
                return true;
              }
              break;
            case 'updated':
              break;
            case 'updatedBy':
              if (formatUserName(item.userInfo).includes(value)) {
                return true;
              }
              break;
            case 'match':
            case 'mapping':
            case 'description':
            case 'date':
              break;
            default:
              if (item[col].includes(value)) {
                return true;
              }
              break;
          }
        }

        return false;
      });

      setCurrentData(newData);
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
      <IntlConsumer>
        {intl => (
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
                <Fragment>
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
                </Fragment>
              )}
            </SearchAndSortQuery>
          </div>
        )}
      </IntlConsumer>
    );
  }

  return (
    <div {...dataAttrs}>
      <IntlConsumer>
        {intl => (
          <AssociatedList
            intl={intl}
            entityKey={entityKey}
            namespaceKey={namespaceKey}
            checkboxList={checkboxList}
            columnWidths={columnWidths}
            profileShape={profileShape}
            contentData={contentData}
            onSort={noop}
            isMultiSelect={isMultiSelect}
          />
        )}
      </IntlConsumer>
    </div>
  );
};

AssociatorStatic.propTypes = {
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
