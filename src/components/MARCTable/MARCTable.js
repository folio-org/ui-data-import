import React, {
  useEffect,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';

import {
  set,
  cloneDeep,
} from 'lodash';

import {
  MARCTableHeader,
  MARCTableRowContainer,
} from '.';

import css from './MARCTable.css';

import {
  fillEmptyFieldsWithValue,
  mappingMARCFieldShape,
} from '../../utils';

const defaultColumnWidths = {
  arrows: '70px',
  action: '100px',
  field: '120px',
  indicator1: '93px',
  indicator2: '93px',
  subfield: '93px',
  subaction: '140px',
  data: '340px',
  position: '140px',
  addRemove: '70px',
};

export const MARCTable = ({
  columns,
  fields,
  onChange,
  columnWidths = defaultColumnWidths,
  isFirstRowRemovable = false,
  fillNewRowFieldsWithDefaultValue = false,
}) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (fields) {
      setRows(fields);
    }
  }, [fields]);

  const addNewRow = index => {
    const incrementOrders = row => ({
      ...row,
      order: row.order + 1,
    });

    const newRow = {
      order: index,
      field: { subfields: [{}] },
    };
    const updatedField = fillEmptyFieldsWithValue(newRow,
      ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*');

    const updatedRows = [
      ...rows.slice(0, index),
      fillNewRowFieldsWithDefaultValue ? updatedField : newRow,
      ...rows.slice(index).map(incrementOrders),
    ];

    onChange('profile.mappingDetails.marcMappingDetails', updatedRows);
  };

  const removeRow = index => {
    const decrementOrders = row => ({
      ...row,
      order: row.order - 1,
    });

    const updatedRows = [
      ...rows.slice(0, index),
      ...rows.slice(index + 1).map(decrementOrders),
    ];

    onChange('profile.mappingDetails.marcMappingDetails', updatedRows);
  };

  const moveRow = (order, orderToSwitch) => {
    const rowIndex = rows.findIndex(field => field.order === order);
    const rowToSwitchIndex = rows.findIndex(field => field.order === orderToSwitch);
    const updatedRows = [...rows];

    const rowToSwitch = {
      ...updatedRows[rowToSwitchIndex],
      order,
    };

    updatedRows[rowToSwitchIndex] = {
      ...updatedRows[rowIndex],
      order: orderToSwitch,
    };
    updatedRows[rowIndex] = rowToSwitch;

    onChange('profile.mappingDetails.marcMappingDetails', updatedRows);
  };

  const addSubfieldRow = order => {
    const updatedRows = [...rows];
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);
    const rowToUpdate = updatedRows[rowToUpdateIndex];

    updatedRows[rowToUpdateIndex] = {
      ...rowToUpdate,
      field: {
        ...rowToUpdate.field,
        subfields: [...rowToUpdate.field.subfields, {}],
      },
    };

    onChange('profile.mappingDetails.marcMappingDetails', updatedRows);
  };

  const removeSubfieldRow = (order, index) => {
    const updatedRows = [...rows];
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);
    const rowToUpdate = updatedRows[rowToUpdateIndex];

    const newSubfields = [
      ...rowToUpdate.field.subfields.slice(0, index),
      ...rowToUpdate.field.subfields.slice(index + 1),
    ];
    const lastSubfieldIndex = newSubfields.length - 1;

    newSubfields[lastSubfieldIndex] = {
      ...newSubfields[lastSubfieldIndex],
      subaction: null,
    };

    updatedRows[rowToUpdateIndex] = {
      ...rowToUpdate,
      field: {
        ...rowToUpdate.field,
        subfields: newSubfields,
      },
    };

    onChange('profile.mappingDetails.marcMappingDetails', updatedRows);
  };

  const removeSubfieldsFromRow = rowToUpdate => {
    const updatedField = cloneDeep(rowToUpdate);
    const firstSubfield = rowToUpdate.field.subfields?.[0] || {};
    const updatedSubfields = [{
      ...firstSubfield,
      subaction: null,
      position: null,
    }];

    set(updatedField, 'field.subfields', updatedSubfields);

    return updatedField;
  };

  const removeSubactionFromRow = rowToUpdate => {
    const updatedField = cloneDeep(rowToUpdate);
    const subfields = rowToUpdate.field.subfields;

    subfields.forEach((subfield, index) => {
      set(updatedField, `field.subfields[${index}].subaction`, null);
    });

    return updatedField;
  };

  const removeDataValuesFromRow = rowToUpdate => {
    const updatedField = cloneDeep(rowToUpdate);
    const subfields = rowToUpdate.field.subfields;

    subfields.forEach((subfield, index) => {
      set(updatedField, `field.subfields[${index}].data`, null);
    });

    return updatedField;
  };

  const removePositionFromRow = rowToUpdate => {
    const updatedField = cloneDeep(rowToUpdate);
    const subfields = rowToUpdate.field.subfields;

    subfields.forEach((subfield, index) => {
      set(updatedField, `field.subfields[${index}].position`, null);
    });

    return updatedField;
  };

  const onFieldUpdate = (order, rowToUpdate) => {
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);

    onChange(`profile.mappingDetails.marcMappingDetails[${rowToUpdateIndex}]`, rowToUpdate);
  };

  return (
    <div
      data-test-marc-table
      className={css.tableContainer}
    >
      <MARCTableHeader
        columns={columns}
        columnWidths={columnWidths}
      />
      <MARCTableRowContainer
        columns={columns}
        fields={rows}
        columnWidths={columnWidths}
        onFieldUpdate={onFieldUpdate}
        onAddNewRow={addNewRow}
        onRemoveRow={removeRow}
        onMoveRow={moveRow}
        onAddSubfieldRow={addSubfieldRow}
        onRemoveSubfieldRow={removeSubfieldRow}
        removeSubfieldRows={removeSubfieldsFromRow}
        removePositionFromRow={removePositionFromRow}
        removeSubactionFromRow={removeSubactionFromRow}
        removeDataValuesFromRow={removeDataValuesFromRow}
        isFirstRowRemovable={isFirstRowRemovable}
      />
    </div>
  );
};

MARCTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  fields: PropTypes.arrayOf(mappingMARCFieldShape.isRequired).isRequired,
  columnWidths: PropTypes.object,
  onChange: PropTypes.func,
  isFirstRowRemovable: PropTypes.bool,
  fillNewRowFieldsWithDefaultValue: PropTypes.bool,
};
