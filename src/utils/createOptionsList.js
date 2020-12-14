export const createOptionsList = (array, formatMessage, customLabel) => array.map(option => ({
  value: option.value,
  label: formatMessage({ id: option[customLabel] || option.label }),
}));
