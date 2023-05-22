import { isEmpty } from 'lodash';
import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  fillCellWithNoValues,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const InvoiceCell = ({
  invoiceActionStatus,
  sourceRecordId,
  jobLogRecords,
  sortedItemData,
  sourceRecordOrder,
}) => {
  const entityLabel = getRecordActionStatusLabel(invoiceActionStatus);
  const sourceRecord = jobLogRecords.find(item => {
    const isIdEqual = item.sourceRecordId === sourceRecordId;
    const isOrderEqual = item.relatedInvoiceLineInfo?.fullInvoiceLineNumber === sourceRecordOrder;

    return isIdEqual && isOrderEqual;
  });

  if (!invoiceActionStatus && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData);
  }

  const invoiceId = sourceRecord?.relatedInvoiceInfo.idList[0];
  const invoiceLineId = sourceRecord?.relatedInvoiceLineInfo.id;
  const path = `/invoice/view/${invoiceId}/line/${invoiceLineId}/view`;

  const isPathCorrect = !!(invoiceId && invoiceLineId);
  const isHotlink = isPathCorrect && (invoiceActionStatus === RECORD_ACTION_STATUS.CREATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'invoice');
};
