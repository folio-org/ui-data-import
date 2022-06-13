import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { STATE_MANAGEMENT } from './constants';

/**
 * Hook that provides checkbox list functionality
 *
 * @param {Array<{ id: string, [key: string]: any}>} list
 * @param {Set<string>} initialSelectedRecords
 * @return {{
 *   selectedRecords: Set,
 *   isAllSelected: boolean,
 *   selectRecord: (id: string) => void,
 *   selectAll: () => void,
 *   deselectAll: () => void,
 *   handleSelectAllCheckbox: (e: Event) => void,
 * }}
 */
export const useCheckboxList = (list = [], initialSelectedRecords) => {
  const [selectedRecords, setSelectedRecords] = useState(initialSelectedRecords ?? new Set());

  const listLength = list.length;
  const isAllSelected = (listLength !== 0) && (selectedRecords.size === listLength);

  const selectRecord = id => {
    setSelectedRecords(selectedRecordsState => {
      const isRecordSelected = selectedRecordsState.has(id);

      if (isRecordSelected) {
        selectedRecordsState.delete(id);
      } else {
        selectedRecordsState.add(id);
      }

      return new Set(selectedRecordsState);
    });
  };

  const selectAll = () => {
    const selectedRecordsState = new Set(list.map(({ id }) => id));

    setSelectedRecords(selectedRecordsState);
  };

  const deselectAll = () => setSelectedRecords(new Set());

  const handleSelectAllCheckbox = e => {
    if (e.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  return {
    selectedRecords,
    isAllSelected,
    selectRecord,
    selectAll,
    deselectAll,
    handleSelectAllCheckbox,
  };
};

/**
 * HOC for class components.
 * In order to make it work `setList` must be called with actual list in decorated component.
 * `setList` must be called again on each list change (e.g. after item added or deleted).
 *
 * @param {{pageKey: string}} config - config object that is used to customize HOC
 * @returns {(WrappedComponent: import('react').ComponentType) => React.FC}
 * */
export const withCheckboxList = config => (WrappedComponent) => props => {
  const [list, setList] = useState([]);

  // get initial value for selected records if persisted in redux store
  const selectedRecords = useSelector(state => get(state, [
    STATE_MANAGEMENT.DI_REDUCER,
    'selectedRecords',
    config.pageKey,
  ], new Set()));

  const checkboxList = useCheckboxList(list, selectedRecords);

  return (
    <WrappedComponent
      {...props}
      setList={setList}
      checkboxList={checkboxList}
    />
  );
};

export const checkboxListShape = PropTypes.shape({
  selectedRecords: PropTypes.instanceOf(Set).isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  selectRecord: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  handleSelectAllCheckbox: PropTypes.func.isRequired,
});
