export const createOptionsList = (array, formatMessage) => array.map(option => ({
  value: option.value,
  label: formatMessage({ id: option.label }),
}));
