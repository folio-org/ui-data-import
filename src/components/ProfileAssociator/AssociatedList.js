import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { getNsKey } from '@folio/stripes-smart-components';

import { checkboxListShape } from '../../utils';
import {
  ENTITY_KEYS,
  SORT_TYPES,
} from '../../utils/constants';

import { jobProfilesShape } from '../../settings/JobProfiles';
import { matchProfilesShape } from '../../settings/MatchProfiles';
import { actionProfilesShape } from '../../settings/ActionProfiles';
import { mappingProfilesShape } from '../../settings/MappingProfiles';

import { associatedProfilesColumns } from './associatedProfilesColumns';

const profiles = {
  [ENTITY_KEYS.JOB_PROFILES]: jobProfilesShape,
  [ENTITY_KEYS.MATCH_PROFILES]: matchProfilesShape,
  [ENTITY_KEYS.ACTION_PROFILES]: actionProfilesShape,
  [ENTITY_KEYS.MAPPING_PROFILES]: mappingProfilesShape,
};

export const AssociatedList = memo(({
  entityKey,
  namespaceKey,
  isMultiSelect,
  isStatic,
  checkboxList,
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
  } = profiles[entityKey];
  const {
    [nsSort]: sortOrderQuery = initialQuery[nsSort],
    [nsQuery]: searchTerm = initialQuery[nsQuery],
  } = initialQuery;

  const sortDirection = sortOrderQuery.startsWith('-') ? SORT_TYPES.DESCENDING : SORT_TYPES.ASCENDING;
  const sortOrder = sortOrderQuery.replace(/^-/, '').replace(/,.*/, '');
  let columns = isStatic && isMultiSelect ? ['selected', ...visibleColumns] : visibleColumns;

  columns = !isStatic ? [...columns, 'unlink'] : columns;

  const descI = columns.findIndex(col => col === 'description');

  if (descI >= 0) {
    columns.splice(descI, 1);
  }

  const rowUpdater = ({ id }) => selectedRecords.has(id);

  const onSort = () => {};

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
  });

  return (
    <MultiColumnList
      id={`associated-${entityKey}-list`}
      visibleColumns={columns}
      columnWidths={columnWidths}
      columnMapping={columnHeaders}
      contentData={contentData}
      formatter={columnTemplates}
      rowUpdater={isMultiSelect ? rowUpdater : noop}
      sortOrder={sortOrder}
      sortDirection={sortDirection}
      onHeaderClick={onSort}
      className={className}
      {...dataAttributes}
    />
  );
});

AssociatedList.propTypes = {
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
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
