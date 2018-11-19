const DATE_TYPES = {
  string: 'string',
  number: 'number',
  Date: 'Date',
};

/**
 * Converts date type
 *
 * @param  {string | number | Date} date Date value
 * @param  {string} [toType = 'string'] Type to convert
 *
 * @returns  {string | number | Date} Converted date
 */
const convertDate = (date, toType = DATE_TYPES.string) => {
  switch (toType) {
    case DATE_TYPES.string:
      return new Date(date).toString();
    case DATE_TYPES.number:
      return new Date(date).valueOf();
    case DATE_TYPES.Date:
      return new Date(date);
    default:
      return date;
  }
};

export default convertDate;
