// eslint-disable-next-line import/prefer-default-export
export const isRequiredFieldValid = value => {
  const isArrayValue = Array.isArray(value);

  if (isArrayValue) {
    if (value.length > 0) {
      return true;
    }
  } else if (value) {
    return true;
  }

  return false;
};
