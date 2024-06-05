import PropTypes from 'prop-types';

import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  fillCellWithNoValues,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const OrderCell = ({
  relatedPoLineInfo,
  sortedItemData = [],
}) => {
  const poLineActionStatus = relatedPoLineInfo.actionStatus;

  if (!poLineActionStatus) {
    return fillCellWithNoValues(sortedItemData);
  }

  const entityLabel = getRecordActionStatusLabel(poLineActionStatus);
  const orderLineId = relatedPoLineInfo.idList[0];
  const path = `/orders/lines/view/${orderLineId}`;

  const isPathCorrect = !!orderLineId;
  const isHotlink = isPathCorrect && poLineActionStatus === RECORD_ACTION_STATUS.CREATED;

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'order');
};

OrderCell.propTypes = {
  relatedPoLineInfo: PropTypes.object.isRequired,
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};
