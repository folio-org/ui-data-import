import {
  get,
  set,
  cloneDeep,
} from 'lodash';

export const fillEmptyFieldsWithValue = (field, fieldNames, valueToFill) => {
  const updatedField = cloneDeep(field);

  fieldNames.forEach(path => {
    const fieldValue = get(field, path, '');

    if (!fieldValue) {
      set(updatedField, path, valueToFill);
    }
  });

  return updatedField;
};
