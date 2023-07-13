import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  getRecordActionStatusLabel,
  getHotlinkCellFormatter,
  fillCellWithNoValues,
} from '../utils';

import { RECORD_ACTION_STATUS } from '../../../../utils';

export const AuthorityCell = ({
  authorityActionStatus,
  sourceRecordId,
  jobLogRecords,
  sortedItemData,
}) => {
  if (!authorityActionStatus && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData);
  }

  const entityLabel = getRecordActionStatusLabel(authorityActionStatus);
  const sourceRecord = jobLogRecords.find(item => item.sourceRecordId === sourceRecordId);
  const authorityId = sourceRecord?.relatedAuthorityInfo.idList[0];
  const path = `/marc-authorities/authorities/${authorityId}`;

  const isPathCorrect = !!authorityId;
  const isHotlink = isPathCorrect && (authorityActionStatus === RECORD_ACTION_STATUS.CREATED
    || authorityActionStatus === RECORD_ACTION_STATUS.UPDATED);

  return getHotlinkCellFormatter(isHotlink, entityLabel, path, 'authority');
};

AuthorityCell.propTypes = {
  sourceRecordId: PropTypes.string.isRequired,
  jobLogRecords: PropTypes.arrayOf(PropTypes.object),
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  authorityActionStatus: PropTypes.string,
};

AuthorityCell.defaultProps = {
  jobLogRecords: [],
  sortedItemData: [],
  authorityActionStatus: '',
};
