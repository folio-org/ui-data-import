import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  BaseLineCell,
} from '../utils';
import { RECORD_ACTION_STATUS } from '../../../../utils';

export const ItemCell = ({
  sortedItemData,
  instanceId,
}) => {
  const { okapi: { tenant } } = useStripes();

  const itemsInfoCell = sortedItemData?.map((sortedItems, itemIndex) => {
    const groupOfItems = sortedItems?.map((item, index) => {
      const entityLabel = getRecordActionStatusLabel(item.actionStatus);
      const holdingsId = item.holdingsId;
      const itemId = item.id;
      const path = `/inventory/view/${instanceId}/${holdingsId}/${itemId}`;
      const isDiscarded = item.actionStatus === RECORD_ACTION_STATUS.DISCARDED;

      const hrId = item.hrid;

      const isPathCorrect = !!(instanceId && holdingsId && itemId);
      const isHotlink = isPathCorrect && (item.actionStatus === RECORD_ACTION_STATUS.CREATED
          || item.actionStatus === RECORD_ACTION_STATUS.UPDATED);

      return (
        <span key={index}>
          {getHotlinkCellFormatter(isHotlink, entityLabel, path, 'item', tenant)}
          {!isDiscarded && hrId ? ` (${hrId})` : ''}
          <br />
        </span>
      );
    });

    return (
      <div key={itemIndex} style={{ paddingBottom: '7px' }}>
        {groupOfItems}
      </div>
    );
  });

  return (
    <BaseLineCell>
      {itemsInfoCell}
    </BaseLineCell>
  );
};

ItemCell.propTypes = {
  instanceId: PropTypes.string.isRequired,
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

ItemCell.defaultProps = { sortedItemData: [] };
