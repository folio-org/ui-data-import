import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Hook that provides checkbox list functionality
 *
 * @param {Array<{ id: string, [key: string]: any}>} list
 * @return {{
 *   selectedRecords: Set,
 *   isAllSelected: boolean,
 *   selectRecord: (id: string) => void,
 *   selectAll: () => void,
 *   deselectAll: () => void,
 *   handleSelectAllCheckbox: (e: Event) => void,
 * }}
 */
const useCheckboxList = (list = []) => {
  const [selectedRecords, setSelectedRecords] = useState(new Set());

  const isAllSelected = selectedRecords.size === list.length;

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
 * @type {(WrappedComponent: import('react').ComponentType) => React.FC}
 */
export const withCheckboxList = WrappedComponent => props => {
  const [list, setList] = useState([]);
  const checkboxList = useCheckboxList(list);

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
