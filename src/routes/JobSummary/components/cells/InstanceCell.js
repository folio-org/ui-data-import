import React from 'react';

import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const InstanceCell = ({
  instanceActionStatus,
  sourceRecordId,
  jobLogRecords,
}) => {
  const entityLabel = getRecordActionStatusLabel(instanceActionStatus);
  const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
  const entityId = sourceRecord?.relatedInstanceInfo.idList[0];
  const path = `/inventory/view/${entityId}`;

  const isPathCorrect = !!entityId;
  const isHotlink = isPathCorrect && (instanceActionStatus === RECORD_ACTION_STATUS.CREATED
    || instanceActionStatus === RECORD_ACTION_STATUS.UPDATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'instance');
};
