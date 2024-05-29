import PropTypes from 'prop-types';

import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  fillCellWithNoValues,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const AuthorityCell = ({
  relatedAuthorityInfo,
  sortedItemData = [],
}) => {
  const authorityActionStatus = relatedAuthorityInfo.actionStatus;

  if (!authorityActionStatus) {
    return fillCellWithNoValues(sortedItemData);
  }

  const entityLabel = getRecordActionStatusLabel(authorityActionStatus);
  const authorityId = relatedAuthorityInfo.idList[0];
  const path = `/marc-authorities/authorities/${authorityId}`;

  const isPathCorrect = !!authorityId;
  const isHotlink = isPathCorrect && (authorityActionStatus === RECORD_ACTION_STATUS.CREATED
    || authorityActionStatus === RECORD_ACTION_STATUS.UPDATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'authority');
};

AuthorityCell.propTypes = {
  relatedAuthorityInfo: PropTypes.object.isRequired,
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};
