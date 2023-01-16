import React, {
  memo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  debounce,
  noop,
} from 'lodash';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import { HTML_LANG_DIRECTIONS } from '@folio/stripes-data-transfer-components/lib/utils';

import { InitialRecordSelect } from './components/InitialRecordSelect';
import { CompareRecordSelect } from './components/CompareRecordSelect';
import { MATCH_INCOMING_RECORD_TYPES } from '../../utils';

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
  onExistingSelect,
  onIncomingSelect,
  isEditable,
}) => {
  const IS_LOCALE_LTR = document.dir === HTML_LANG_DIRECTIONS.LEFT_TO_RIGHT;

  useUpdateOnResize();
  const [existingRecord, setExistingRecord] = useState(undefined);
  const [incomingRecord, setIncomingRecord] = useState(undefined);

  useEffect(() => {
    setExistingRecord(FOLIO_RECORD_TYPES?.[existingRecordType]);
  }, [existingRecordType]);

  useEffect(() => {
    setIncomingRecord(MATCH_INCOMING_RECORD_TYPES?.[incomingRecordType]);
  }, [incomingRecordType]);

  const handleSelect = selectedRecord => {
    setExistingRecord(selectedRecord);
    onExistingSelect(selectedRecord);
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
            setIncomingRecord={onIncomingSelect}
            isEditable={isEditable}
            isLocalLTR={IS_LOCALE_LTR}
          />
        )
        : (
          <InitialRecordSelect
            id={id}
            onItemSelect={handleSelect}
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
