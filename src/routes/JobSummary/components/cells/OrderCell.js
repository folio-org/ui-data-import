import { isEmpty } from 'lodash';
import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  fillCellWithNoValues,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const OrderCell = ({
  poLineActionStatus,
  sourceRecordId,
  jobLogRecords,
  sortedItemData,
}) => {
  if (!poLineActionStatus && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData);
  }

  const entityLabel = getRecordActionStatusLabel(poLineActionStatus);
  const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
  const orderLineId = sourceRecord?.relatedPoLineInfo.idList[0];
  const path = `/orders/lines/view/${orderLineId}`;

  const isPathCorrect = !!orderLineId;
  const isHotlink = isPathCorrect && poLineActionStatus === RECORD_ACTION_STATUS.CREATED;

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'order');
};
