import React, {
  useState,
  useEffect,
} from 'react';
import { debounce } from 'lodash';

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

export const RecordTypesSelect = () => {
  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState();

  return (
    <div data-test-choose-existing-record>
      {existingRecord
        ? (
          <CompareRecordSelect
            incomingRecord={incomingRecord}
            existingRecord={existingRecord}
            setExistingRecord={setExistingRecord}
          />
        )
        : <InitialRecordSelect onItemSelect={setExistingRecord} />
      }
    </div>
  );
};
