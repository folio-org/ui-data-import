import React from 'react';

import { TextLink } from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import { createUrl } from '@folio/stripes-data-transfer-components/lib/utils';

import { BaseLineCell } from '../utils';
import { RECORD_ACTION_STATUS } from '../../../../utils';

export const TitleCell = ({
  isEdifactType,
  sourceRecordId,
  sourceRecordType,
  sourceRecordTitle,
  holdingsActionStatus,
  sourceRecordActionStatus,
  invoiceLineJournalRecordId,
  jobLogEntriesRecords,
}) => {
  const jobExecutionId = jobLogEntriesRecords[0]?.jobExecutionId;
  const path = createUrl(`/data-import/log/${jobExecutionId}/${sourceRecordId}`,
    isEdifactType ? { instanceLineId: invoiceLineJournalRecordId } : {});

  const isHoldingsRecordImportFailed = sourceRecordType === FOLIO_RECORD_TYPES.MARC_HOLDINGS.type
    && (sourceRecordActionStatus === RECORD_ACTION_STATUS.DISCARDED
      || holdingsActionStatus === RECORD_ACTION_STATUS.DISCARDED);

  const title = isHoldingsRecordImportFailed
    ? 'Holdings'
    : sourceRecordTitle;

  return (
    <BaseLineCell>
      <TextLink
        target="_blank"
        rel="noopener noreferrer"
        to={path}
      >
        {title}
      </TextLink>
    </BaseLineCell>
  );
};
