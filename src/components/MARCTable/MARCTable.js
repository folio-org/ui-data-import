import React, {
  useEffect,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';

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

    onChange(updatedRows);
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

    onChange(updatedRows);
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

    onChange(updatedRows);
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

    onChange(updatedRows);
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

    onChange(updatedRows);
  };

  const removeSubfieldRows = order => {
    const updatedRows = [...rows];
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);
    const rowToUpdate = updatedRows[rowToUpdateIndex];

    updatedRows[rowToUpdateIndex] = {
      ...rowToUpdate,
      field: {
        ...rowToUpdate.field,
        subfields: [{}],
      },
    };

    onChange(updatedRows);
  };

  const fillEmptyFieldOnDeleteAction = (order, items, valueToFill) => {
    const updatedRows = [...rows];
    const rowToUpdateIndex = rows.findIndex(row => row.order === order);

    items
      // eslint-disable-next-line array-callback-return
      .map(item => {
        const isSubfieldField = item.name === 'subfield';
        const rowToUpdate = updatedRows[rowToUpdateIndex];

        updatedRows[rowToUpdateIndex] = {
          ...rowToUpdate,
          field: {
            ...rowToUpdate.field,
            ...(!isSubfieldField && { [item.name]: valueToFill }),
            ...(isSubfieldField && { subfields: [{ subfield: valueToFill }] }),
          },
        };

        onChange(updatedRows);
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
        onRemoveActionSelect={fillEmptyFieldOnDeleteAction}
      />
    </div>
  );
};

MARCTable.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
};
