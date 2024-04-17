import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  BaseLineCell,
  fillCellWithNoValues,
} from '../utils';

export const ErrorCell = ({
  sortedItemData,
}) => {
  if (!isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData, true);
  }

  return <BaseLineCell><FormattedMessage id="ui-data-import.error" /></BaseLineCell>;
};

ErrorCell.propTypes = {
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

ErrorCell.defaultProps = {
  sortedItemData: [],
};
