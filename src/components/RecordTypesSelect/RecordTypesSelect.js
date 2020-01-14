import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  debounce,
  isEmpty,
} from 'lodash';

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
  record,
  onRecordSelect,
}) => {
  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState();
  const isEditable = isEmpty(record);

  const handleSelect = selectedRecord => {
    setExistingRecord(selectedRecord);
    onRecordSelect(selectedRecord);
  };

  return (
    <div
      data-test-choose-existing-record
      id={id}
    >
      {existingRecord || !isEditable
        ? (
          <CompareRecordSelect
            id={id}
            incomingRecord={incomingRecord}
            existingRecord={isEditable ? existingRecord : record}
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
  record: PropTypes.object,
  onRecordSelect: PropTypes.func,
};

RecordTypesSelect.defaultProps = {
  id: 'compare-record-types',
  record: {},
};
