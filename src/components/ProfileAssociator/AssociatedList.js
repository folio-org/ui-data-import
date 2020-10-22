import React, {
  memo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { getNsKey } from '@folio/stripes/smart-components';

import {
  buildSortOrder,
  sortNums,
  sortStrings,
  sortDates,
  checkboxListShape,
  SORT_TYPES,
} from '../../utils';

import { searchAndSortTemplate } from '../ListTemplate';
import { associatedProfilesColumns } from './associatedProfilesColumns';

export const AssociatedList = memo(({
  intl,
  entityKey,
  namespaceKey,
  isMultiSelect,
  isStatic,
  checkboxList,
  profileShape,
  columnWidths,
  contentData,
  className,
  onRemove,
  dataAttributes,
}) => {
  const nsSort = getNsKey('sort', namespaceKey);
  const nsQuery = getNsKey('query', namespaceKey);
  const initialQuery = {
    [nsSort]: 'name',
    [nsQuery]: '',
  };
  const {
    selectRecord,
    selectedRecords,
  } = checkboxList;
  const {
    visibleColumns,
    renderHeaders,
  } = profileShape;
  const {
    [nsSort]: sortOrderQuery = initialQuery[nsSort],
    [nsQuery]: searchTerm = initialQuery[nsQuery],
  } = initialQuery;

  const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
  const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');
  const sortTemplate = searchAndSortTemplate(intl);
  let columns = isStatic && isMultiSelect ? ['selected', ...visibleColumns] : visibleColumns;

  columns = !isStatic ? [...columns, 'unlink'] : columns;

  const descI = columns.findIndex(col => col === 'description');

  if (descI >= 0) {
    columns.splice(descI, 1);
  }

  const [currentData, setCurrentData] = useState([]);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [currentSortDirection, setCurrentSortDirection] = useState(sortDirection);

  const localSort = (dataSet, curOrder, curDir) => {
    const order = curOrder.replace(/^-/, '').replace(/,.*/, '');

    return dataSet.sort((rowA, rowB) => {
      const colA = sortTemplate[order](rowA);
      const colB = sortTemplate[order](rowB);

      switch (order) {
        case 'updated':
          return curDir === SORT_TYPES.ASCENDING ? sortDates(colA, colB) : sortDates(colB, colA);
        case 'order':
          return curDir === SORT_TYPES.ASCENDING ? sortNums(colA, colB) : sortNums(colB, colA);
        default:
          return curDir === SORT_TYPES.ASCENDING ? sortStrings(colA, colB) : sortStrings(colB, colA);
      }
    });
  };

  useEffect(() => {
    const newData = localSort(contentData, currentSortOrder, currentSortDirection);

    setCurrentData(newData);
  }, [contentData]); // eslint-disable-line react-hooks/exhaustive-deps

  const rowUpdater = ({ id }) => selectedRecords.has(id);

  const onSort = (e, meta) => {
    const newSortOrder = buildSortOrder(currentSortOrder, meta.name, sortOrder, 1);
    const newSortDirection = newSortOrder.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;

    setCurrentSortOrder(newSortOrder);
    setCurrentSortDirection(newSortDirection);

    const newData = localSort(currentData, newSortOrder, newSortDirection);

    setCurrentData(newData);
  };

  const columnHeaders = renderHeaders({
    checkboxList,
    unlink: true,
  });
  const columnTemplates = associatedProfilesColumns({
    entityKey,
    isStatic,
    isMultiSelect,
    searchTerm,
    selectRecord,
    selectedRecords,
    onRemove,
    intl,
  });

  return (
    <MultiColumnList
      id={`associated-${entityKey}-list`}
      visibleColumns={columns}
      columnWidths={columnWidths}
      columnMapping={columnHeaders}
      contentData={currentData}
      formatter={columnTemplates}
      rowUpdater={isMultiSelect ? rowUpdater : noop}
      sortOrder={currentSortOrder.replace(/^-/, '').replace(/,.*/, '')}
      sortDirection={currentSortDirection}
      onHeaderClick={onSort}
      className={className}
      {...dataAttributes}
    />
  );
});

AssociatedList.propTypes = {
  intl: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  profileShape: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
  isStatic: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  dataAttributes: PropTypes.shape(PropTypes.object),
  contentData: PropTypes.arrayOf(PropTypes.object),
  selectedRecord: PropTypes.object,
  checkboxList: checkboxListShape,
  columnWidths: PropTypes.object,
  className: PropTypes.string || PropTypes.object,
};

AssociatedList.defaultProps = {
  isMultiSelect: false,
  isStatic: true,
  dataAttributes: null,
  contentData: null,
  onRemove: noop,
};
