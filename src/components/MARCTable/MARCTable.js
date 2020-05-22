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

// TODO: Connect table to the form once BE be ready
export const MARCTable = ({
  fields,
  intl,
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

    setRows(updatedRows);
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

    setRows(updatedRows);
  };

  const updateRowsData = (updatedRow, order) => {
    const rowIndex = rows.findIndex(field => field.order === order);
    const updatedRows = [...rows];

    updatedRows[rowIndex] = { ...updatedRow };
    setRows(updatedRows);
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

    setRows(updatedRows);
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
        intl={intl}
      />
      <MARCTableRowContainer
        fields={rows}
        columnWidths={columnWidths}
        onAddNewRow={addNewRow}
        onRemoveRow={removeRow}
        onMoveRow={moveRow}
        onDataChange={updateRowsData}
        intl={intl}
      />
    </div>
  );
};

MARCTable.propTypes = {
  intl: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object),
};

MARCTable.defaultProps = {
  fields: [
    {
      order: 0,
      data: {
        text: '',
        find: '',
        replace: '',
        field: '',
        indicator1: '',
        indicator2: '',
        subfield: '',
      },
    },
  ],
};
