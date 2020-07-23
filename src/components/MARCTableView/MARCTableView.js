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
    action: '90px',
    field: '90px',
    indicator1: '63px',
    indicator2: '63px',
    subfield: '93px',
    subaction: '140px',
    data: '340px',
    position: '100px',
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
