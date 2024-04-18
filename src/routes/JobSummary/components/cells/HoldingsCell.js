import React from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  BaseLineCell,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const HoldingsCell = ({
  instanceId,
  relatedHoldingsInfo,
  relatedItemInfo,
  locations,
}) => {
  const { okapi: { tenant } } = useStripes();

  const holdingsInfoCell = relatedHoldingsInfo.map((holdings, index) => {
    const entityLabel = getRecordActionStatusLabel(holdings.actionStatus);
    const holdingsId = holdings.id;
    const path = `/inventory/view/${instanceId}/${holdingsId}`;
    const locationId = holdings.permanentLocationId;
    const isDiscarded = holdings.actionStatus === RECORD_ACTION_STATUS.DISCARDED;

    const locationCode = locations.find(locationItem => locationId === locationItem.id)?.code;

    const itemForHoldingsCount = relatedItemInfo.filter(item => item.holdingsId === holdings.id).length;

    const isPathCorrect = !!(instanceId && holdingsId);
    const isHotlink = isPathCorrect && (holdings.actionStatus === RECORD_ACTION_STATUS.CREATED
        || holdings.actionStatus === RECORD_ACTION_STATUS.UPDATED);

    const spacing = !isDiscarded
      ? Array.from({ length: itemForHoldingsCount }, (_, i) => <br key={i} />)
      : <br />;

    return (
      <div key={index} style={{ paddingBottom: '7px' }}>
        {getHotlinkCellFormatter(isHotlink, entityLabel, path, 'holdings', tenant)}
        {!isDiscarded && locationCode ? ` (${locationCode})` : ''}
        {spacing}
      </div>
    );
  });

  return (
    <BaseLineCell>
      {holdingsInfoCell}
    </BaseLineCell>
  );
};

HoldingsCell.propTypes = {
  relatedHoldingsInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
  relatedItemInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  instanceId: PropTypes.string.isRequired,
};
