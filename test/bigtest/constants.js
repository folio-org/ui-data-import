import faker from 'faker';

import formatDateString from './helpers/formatDateString';

const DATE_FORMAT = 'YYYY-MM-DD';
const startDateFuture = formatDateString(faker.date.future(0.1).toString());
const datePickerOptions = ['Today', 'Choose date'];
const repeatableDataOptions = {
  EXTEND_EXISTING: 'Add these to existing',
  DELETE_EXISTING: 'Delete all existing values',
  EXCHANGE_EXISTING: 'Delete all existing and add these',
  DELETE_INCOMING: 'Find and remove these',
};

export {
  DATE_FORMAT,
  startDateFuture,
  datePickerOptions,
  repeatableDataOptions,
};
