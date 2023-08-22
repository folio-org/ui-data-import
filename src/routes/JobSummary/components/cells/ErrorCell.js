import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  BaseLineCell,
  fillCellWithNoValues,
} from '../utils';

export const ErrorCell = ({
  error,
  sortedItemData,
}) => {
  if (error && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData, true);
  }

  return error ? <BaseLineCell><FormattedMessage id="ui-data-import.error" /></BaseLineCell> : '';
};

ErrorCell.propTypes = {
  error: PropTypes.string,
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

ErrorCell.defaultProps = {
  error: '',
  sortedItemData: [],
};
