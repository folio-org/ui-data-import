import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  fillCellWithNoValues,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const InvoiceCell = ({
  relatedInvoiceInfo,
  relatedInvoiceLineInfo,
  sortedItemData,
}) => {
  const invoiceActionStatus = relatedInvoiceInfo.actionStatus;

  if (!invoiceActionStatus && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData);
  }

  const entityLabel = getRecordActionStatusLabel(invoiceActionStatus);

  const invoiceId = relatedInvoiceInfo.idList[0];
  const invoiceLineId = relatedInvoiceLineInfo.id;
  const path = `/invoice/view/${invoiceId}/line/${invoiceLineId}/view`;

  const isPathCorrect = !!(invoiceId && invoiceLineId);
  const isHotlink = isPathCorrect && (invoiceActionStatus === RECORD_ACTION_STATUS.CREATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'invoice');
};

InvoiceCell.propTypes = {
  relatedInvoiceInfo: PropTypes.object.isRequired,
  relatedInvoiceLineInfo: PropTypes.object.isRequired,
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

InvoiceCell.defaultProps = { sortedItemData: [] };
