import PropTypes from 'prop-types';
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
  if (!invoiceActionStatus && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData);
  }

  const entityLabel = getRecordActionStatusLabel(invoiceActionStatus);
  const sourceRecord = jobLogRecords.find(item => {
    const isIdEqual = item.sourceRecordId === sourceRecordId;
    const isOrderEqual = item.relatedInvoiceLineInfo?.fullInvoiceLineNumber === sourceRecordOrder;

    return isIdEqual && isOrderEqual;
  });

  const invoiceId = sourceRecord?.relatedInvoiceInfo.idList[0];
  const invoiceLineId = sourceRecord?.relatedInvoiceLineInfo.id;
  const path = `/invoice/view/${invoiceId}/line/${invoiceLineId}/view`;

  const isPathCorrect = !!(invoiceId && invoiceLineId);
  const isHotlink = isPathCorrect && (invoiceActionStatus === RECORD_ACTION_STATUS.CREATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'invoice');
};

InvoiceCell.propTypes = {
  sourceRecordId: PropTypes.string.isRequired,
  sourceRecordOrder: PropTypes.number.isRequired,
  jobLogRecords: PropTypes.arrayOf(PropTypes.object),
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  invoiceActionStatus: PropTypes.string,
};

InvoiceCell.defaultProps = {
  jobLogRecords: [],
  sortedItemData: [],
  invoiceActionStatus: '',
};
