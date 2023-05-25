import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { fillCellWithNoValues } from '../utils';

export const ErrorCell = ({
  error,
  sortedItemData
}) => {
  if (!error && !isEmpty(sortedItemData)) {
    return fillCellWithNoValues(sortedItemData, true);
  }

  return error ? <FormattedMessage id="ui-data-import.error" /> : '';
};

ErrorCell.propTypes = {
  error: PropTypes.string,
  sortedItemData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

ErrorCell.defaultProps = {
  error: '',
  sortedItemData: [],
};
