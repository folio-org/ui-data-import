import React, {
  useEffect,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';

import { get } from 'lodash';

import {
  MARCTableHeader,
  MARCTableRowContainer,
} from '.';

import css from './MARCTable.css';

export const MARCTable = ({
  fields,
  onChange,
}) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(fields);
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
    const updatedRows = [
      ...rows.slice(0, index),
      newRow,
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

  const removeSubfieldRows = order => {
    const updatedRows = [...rows];
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);
    const firstSubfield = updatedRows[rowToUpdateIndex].field?.subfields?.[0] || {};

    const subfields = [firstSubfield];

    onChange(`profile.mappingDetails.marcMappingDetails[${rowToUpdateIndex}].field.subfields`, subfields);
  };

  const fillEmptyFieldsWithValue = (order, fieldNames, valueToFill) => {
    const updatedRows = [...rows];
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);
    const rowToUpdate = JSON.parse(JSON.stringify(updatedRows[rowToUpdateIndex]));

    fieldNames.forEach(path => {
      const fieldValue = get(rowToUpdate, path, '');

      if (!fieldValue) {
        onChange(`profile.mappingDetails.marcMappingDetails[${rowToUpdateIndex}].${path}`, valueToFill);
      }
    });
  };

  const columns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position', 'addRemove'];
  const columnWidths = {
    arrows: '70px',
    action: '100px',
    field: '120px',
    indicator1: '93px',
    indicator2: '93px',
    subfield: '93px',
    subaction: '140px',
    data: '200px',
    position: '140px',
    addRemove: '70px',
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
        fields={rows}
        columnWidths={columnWidths}
        onAddNewRow={addNewRow}
        onRemoveRow={removeRow}
        onMoveRow={moveRow}
        onAddSubfieldRow={addSubfieldRow}
        onRemoveSubfieldRow={removeSubfieldRow}
        onRemoveSubfieldRows={removeSubfieldRows}
        onDeleteActionSelect={fillEmptyFieldsWithValue}
      />
    </div>
  );
};

MARCTable.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
};
