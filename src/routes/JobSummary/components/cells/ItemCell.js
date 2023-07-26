import React from 'react';

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
  const itemsInfoCell = sortedItemData?.map((sortedItems, itemIndex) => {
    const groupOfItems = sortedItems?.map((item, index) => {
      const entityLabel = getRecordActionStatusLabel(item.actionStatus);
      const holdingsId = item.holdingsId;
      const itemId = item.id;
      const path = `/inventory/view/${instanceId}/${holdingsId}/${itemId}`;
      const isDiscarded = item.actionStatus === 'DISCARDED';

      const hrId = item.hrid;

      const isPathCorrect = !!(instanceId && holdingsId && itemId);
      const isHotlink = isPathCorrect && (item.actionStatus === RECORD_ACTION_STATUS.CREATED
          || item.actionStatus === RECORD_ACTION_STATUS.UPDATED);

      return (
        <span key={index}>
          {getHotlinkCellFormatter(isHotlink, entityLabel, path, 'item')}
          {!isDiscarded && hrId ? ` (${hrId})` : ''}
          <br />
        </span>
      );
    });

    return (
      <div key={itemIndex} style={{ display: 'inline-block', paddingBottom: '7px' }}>
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
