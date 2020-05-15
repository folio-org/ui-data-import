import moment from 'moment';

import { DATE_FORMAT } from '../constants';

const formatDateString = string => {
  const date = moment.utc(string);

  return date.format(DATE_FORMAT);
};

export default formatDateString;
