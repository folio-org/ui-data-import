import PropTypes from 'prop-types';

import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const InstanceCell = ({ relatedInstanceInfo }) => {
  const instanceActionStatus = relatedInstanceInfo.actionStatus;
  const entityLabel = getRecordActionStatusLabel(instanceActionStatus);
  const entityId = relatedInstanceInfo.idList[0];
  const path = `/inventory/view/${entityId}`;

  const isPathCorrect = !!entityId;
  const isHotlink = isPathCorrect && (instanceActionStatus === RECORD_ACTION_STATUS.CREATED
    || instanceActionStatus === RECORD_ACTION_STATUS.UPDATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'instance');
};

InstanceCell.propTypes = { relatedInstanceInfo: PropTypes.object.isRequired };
