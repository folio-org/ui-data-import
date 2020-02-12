import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { InitialRecordSelect } from './components/InitialRecordSelect';
import { CompareRecordSelect } from './components/CompareRecordSelect';
import { FOLIO_RECORD_TYPES } from '../ListTemplate';

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

const incomingRecord = FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC;

export const RecordTypesSelect = ({
  id,
  existingRecordType,
  onRecordSelect,
  isEditable,
}) => {
  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState(undefined);

  useEffect(() => {
    setExistingRecord(FOLIO_RECORD_TYPES[existingRecordType] || undefined);
  }, [existingRecordType]);

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
            isEditable={isEditable}
          />
        )
        : (
          <InitialRecordSelect
            id={id}
            onItemSelect={handleSelect}
          />
        )
      }
    </div>
  );
};

RecordTypesSelect.propTypes = {
  id: PropTypes.string,
  existingRecordType: PropTypes.string,
  onRecordSelect: PropTypes.func,
  isEditable: PropTypes.bool,
};

RecordTypesSelect.defaultProps = {
  id: 'compare-record-types',
  isEditable: true,
};
