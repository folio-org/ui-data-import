const INVALID_DATE = 'Invalid Date';

export const DATE_TYPES = {
  string: 'string',
  number: 'number',
  Date: 'Date',
};

/**
 * Converts date type.
 * Returns first parameter if date or type are not valid values.
 *
 * @param  {string | number | Date} date Date value
 * @param  {string} [toType = 'string'] Type to convert
 *
 * @returns  {string | number | Date} Converted date
 */
export const convertDate = (date, toType = DATE_TYPES.string) => {
  const _date = new Date(date);

  if (_date.toString() === INVALID_DATE) {
    return date;
  }

  switch (toType) {
    case DATE_TYPES.string:
      return _date.toString();
    case DATE_TYPES.number:
      return _date.valueOf();
    case DATE_TYPES.Date:
      return _date;
    default:
      return date;
  }
};
