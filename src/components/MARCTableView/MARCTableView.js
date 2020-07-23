import React from 'react';
import { PropTypes } from 'prop-types';

import { MARCTableHeader } from '../MARCTable';
import { MARCTableViewRowContainer } from '.';

import css from '../MARCTable/MARCTable.css';

import { mappingMARCFieldShape } from '../../utils';

export const MARCTableView = ({ fields }) => {
  const columns = ['action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position'];

  const columnWidths = {
    action: '100px',
    field: '120px',
    indicator1: '93px',
    indicator2: '93px',
    subfield: '93px',
    subaction: '140px',
    data: '200px',
    position: '140px',
  };

  return (
    <div
      data-test-marc-table-view
      className={css.tableContainer}
    >
      <MARCTableHeader
        columns={columns}
        columnWidths={columnWidths}
      />
      <MARCTableViewRowContainer
        fields={fields}
        columnWidths={columnWidths}
      />
    </div>
  );
};

MARCTableView.propTypes = { fields: PropTypes.arrayOf(mappingMARCFieldShape.isRequired).isRequired };
