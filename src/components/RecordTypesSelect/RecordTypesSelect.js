import React, {
  useState,
  useEffect,
} from 'react';
import { debounce } from 'lodash';

import { IncomingRecordSelect } from './components/IncomingRecordSelect';
import { ExistingRecordSelect } from './components/ExistingRecordSelect';
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

export const RecordTypesSelect = () => {
  useUpdateOnResize();
  const [incomingRecord, setIncomingRecord] = useState();
  const [existingRecord, setExistingRecord] = useState(FOLIO_RECORD_TYPES.INSTANCE);

  return (
    <div data-test-record-types-select>
      {incomingRecord
        ? (
          <ExistingRecordSelect
            incomingRecord={incomingRecord}
            existingRecord={existingRecord}
            setIncomingRecord={setIncomingRecord}
            setExistingRecord={setExistingRecord}
          />
        )
        : <IncomingRecordSelect onItemSelect={setIncomingRecord} />
      }
    </div>
  );
};
