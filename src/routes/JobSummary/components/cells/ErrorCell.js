import { FormattedMessage } from 'react-intl';
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
