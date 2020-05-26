import { get } from 'lodash';

export const onAdd = (refTable, fieldName, fieldIndex, initialFields, callback, incrementalField) => {
  const fieldsPath = `profile.mappingDetails.mappingFields[${fieldIndex}].subfields`;
  let newInitRow = { ...get(initialFields, [fieldName], {}) };

  if (incrementalField) {
    newInitRow = {
      ...newInitRow,
      [incrementalField]: refTable.length,
    };
  }

  refTable.push(newInitRow);
  callback(fieldsPath, refTable);
};

export const onRemove = (index, refTable, fieldIndex, callback, incrementalField) => {
  const fieldsPath = `profile.mappingDetails.mappingFields[${fieldIndex}].subfields`;
  let newRefTable = [...refTable];

  newRefTable.splice(index, 1);

  if (incrementalField) {
    newRefTable = newRefTable.map((row, i) => ({
      ...row,
      [incrementalField]: i,
    }));
  }

  callback(fieldsPath, newRefTable);
};
