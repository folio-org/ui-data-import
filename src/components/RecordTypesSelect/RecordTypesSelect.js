import React, {
  memo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { InitialRecordSelect } from './components/InitialRecordSelect';
import { CompareRecordSelect } from './components/CompareRecordSelect';
import {
  FOLIO_RECORD_TYPES,
  INCOMING_RECORD_TYPES,
} from '../ListTemplate';

const useForceUpdate = () => useState()[1];

const useUpdateOnResize = () => {
  // forceUpdate is used to re-render elements that are depending on DOM such as TreeLine
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const handleResize = debounce(forceUpdate);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [forceUpdate]);
};

export const RecordTypesSelect = memo(({
  id,
  existingRecordType,
  incomingRecordType,
  onRecordSelect,
  onIncomingRecordChange,
  isEditable,
}) => {
  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState(undefined);
  const [incomingRecord, setIncomingRecord] = useState(undefined);

  useEffect(() => {
    setExistingRecord(FOLIO_RECORD_TYPES[existingRecordType] || undefined);
  }, [existingRecordType]);

  useEffect(() => {
    setIncomingRecord(INCOMING_RECORD_TYPES[incomingRecordType] || undefined);
  }, [incomingRecordType]);

  const handleSelect = selectedRecord => {
    setExistingRecord(selectedRecord);
    onRecordSelect(selectedRecord);
  };

  return (
    <div
      data-test-choose-existing-record
      id={id}
    >
      {existingRecord
        ? (
          <CompareRecordSelect
            id={id}
            incomingRecord={incomingRecord}
            existingRecord={existingRecord}
            setExistingRecord={handleSelect}
            setIncomingRecord={onIncomingRecordChange}
            isEditable={isEditable}
          />
        )
        : (
          <InitialRecordSelect
            id={id}
            onItemSelect={handleSelect}
            isEditable={isEditable}
          />
        )
      }
    </div>
  );
});

RecordTypesSelect.propTypes = {
  id: PropTypes.string,
  existingRecordType: PropTypes.string,
  incomingRecordType: PropTypes.string,
  onRecordSelect: PropTypes.func,
  onIncomingRecordChange: PropTypes.func,
  isEditable: PropTypes.bool,
};

RecordTypesSelect.defaultProps = {
  id: 'compare-record-types',
  incomingRecordType: INCOMING_RECORD_TYPES.MARC_BIBLIOGRAPHIC,
  isEditable: true,
};
