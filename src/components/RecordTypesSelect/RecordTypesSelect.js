import React, {
  memo,
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  debounce,
  noop,
  pick,
} from 'lodash';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import { HTML_LANG_DIRECTIONS } from '@folio/stripes-data-transfer-components/lib/utils';

import { InitialRecordSelect } from './components/InitialRecordSelect';
import { CompareRecordSelect } from './components/CompareRecordSelect';
import { MATCH_INCOMING_RECORD_TYPES } from '../../utils';

const useForceUpdate = () => useState()[1];

const useUpdateOnResize = () => {
  // forceUpdate is used to re-render elements that depend on DOM such as TreeLine
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const handleResize = debounce(forceUpdate);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [forceUpdate]);
};

export const RecordTypesSelect = memo(({
  id,
  existingRecordType: initialExistingRecord,
  incomingRecordType: initialIncomingRecord,
  onExistingSelect,
  onIncomingSelect,
  isEditable,
}) => {
  const IS_LOCALE_LTR = document.dir === HTML_LANG_DIRECTIONS.LEFT_TO_RIGHT;

  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState(FOLIO_RECORD_TYPES[initialExistingRecord]);
  const [incomingRecord, setIncomingRecord] = useState(MATCH_INCOMING_RECORD_TYPES[initialIncomingRecord]);
  const existingRecordType = existingRecord?.type;

  const getIncomingRecordOptions = (recordType) => {
    switch (recordType) {
      case FOLIO_RECORD_TYPES.INSTANCE.type: {
        return pick(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
          MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type,
        ]);
      }
      case FOLIO_RECORD_TYPES.HOLDINGS.type: {
        return pick(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
          MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type,
        ]);
      }
      case FOLIO_RECORD_TYPES.ITEM.type: {
        return pick(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
          MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type,
        ]);
      }
      case FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type: {
        return pick(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
          MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type,
        ]);
      }
      case FOLIO_RECORD_TYPES.MARC_AUTHORITY.type: {
        return pick(MATCH_INCOMING_RECORD_TYPES, [
          MATCH_INCOMING_RECORD_TYPES.MARC_AUTHORITY.type,
          MATCH_INCOMING_RECORD_TYPES.STATIC_VALUE.type,
        ]);
      }
      default: {
        return MATCH_INCOMING_RECORD_TYPES;
      }
    }
  };

  const incomingRecordOptions = useMemo(
    () => getIncomingRecordOptions(existingRecordType),
    [existingRecordType],
  );

  const handleIncomingRecordSelect = selectedRecord => {
    onIncomingSelect(selectedRecord);
    setIncomingRecord(selectedRecord);
  };

  const handleExistingRecordSelect = selectedRecord => {
    onExistingSelect(selectedRecord);
    setExistingRecord(selectedRecord);

    const updatedIncomingRecordOptions = getIncomingRecordOptions(selectedRecord.type);
    const defaultIncomingRecord = Object.values(updatedIncomingRecordOptions)[0];

    handleIncomingRecordSelect(defaultIncomingRecord);
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
            setExistingRecord={handleExistingRecordSelect}
            setIncomingRecord={handleIncomingRecordSelect}
            incomingRecordOptions={incomingRecordOptions}
            isEditable={isEditable}
            isLocalLTR={IS_LOCALE_LTR}
          />
        )
        : (
          <InitialRecordSelect
            id={id}
            onItemSelect={handleExistingRecordSelect}
            isEditable={isEditable}
            isLocalLTR={IS_LOCALE_LTR}
          />
        )}
    </div>
  );
});

RecordTypesSelect.propTypes = {
  id: PropTypes.string,
  existingRecordType: PropTypes.string,
  incomingRecordType: PropTypes.string,
  onExistingSelect: PropTypes.func,
  onIncomingSelect: PropTypes.func,
  isEditable: PropTypes.bool,
};

RecordTypesSelect.defaultProps = {
  id: 'compare-record-types',
  existingRecordType: '',
  incomingRecordType: MATCH_INCOMING_RECORD_TYPES.MARC_BIBLIOGRAPHIC,
  onExistingSelect: noop,
  onIncomingSelect: noop,
  isEditable: true,
};
