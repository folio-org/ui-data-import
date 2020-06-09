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

    const newRow = { order: index };
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

  const columns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position', 'addRemove'];
  const columnWidths = {
    arrows: '70px',
    action: '100px',
    field: '120px',
    indicator1: '75px',
    indicator2: '75px',
    subfield: '75px',
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
      />
    </div>
  );
};

MARCTable.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
};
