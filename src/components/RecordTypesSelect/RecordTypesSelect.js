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
  // forceUpdate is used to re-render elements that are depending on DOM such as LineBetween
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const handleResize = debounce(forceUpdate);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [forceUpdate]);
};

const incomingRecord = FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC;

export const RecordTypesSelect = ({
  record,
  id,
}) => {
  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState();
  const isEditable = isEmpty(record);

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
            setExistingRecord={setExistingRecord}
            isEditable={isEditable}
          />
        )
        : (
          <InitialRecordSelect
            id={id}
            onItemSelect={setExistingRecord}
          />
        )
      }
    </div>
  );
};

RecordTypesSelect.propTypes = {
  record: PropTypes.object,
  id: PropTypes.string,
};

RecordTypesSelect.defaultProps = { record: {} };
