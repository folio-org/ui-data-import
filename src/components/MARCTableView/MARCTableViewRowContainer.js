import React from 'react';
import { PropTypes } from 'prop-types';

import { MARCTableViewRow } from './MARCTableViewRow';

import { mappingMARCFieldShape } from '../../utils';

import css from '../MARCTable/MARCTable.css';

export const MARCTableViewRowContainer = ({
  fields,
  columnWidths,
}) => {
  const renderRow = (data, i) => {
    const subfieldsData = data.field?.subfields;
    const containsSubsequentLines = subfieldsData?.length > 1;

    const getRowData = index => ({
      action: data.action,
      field: data.field?.field,
      indicator1: data.field?.indicator1,
      indicator2: data.field?.indicator2,
      subfield: subfieldsData?.[index].subfield,
      subaction: subfieldsData?.[index].subaction,
      data: subfieldsData?.[index].data,
      position: subfieldsData?.[index].position,
    });

    return (
      <div
        data-test-marc-table-view-row={data.order}
        key={i}
        className={css.tableRowContainer}
      >
        <MARCTableViewRow
          rowData={getRowData(0)}
          columnWidths={columnWidths}
        />
        {containsSubsequentLines &&
          subfieldsData.map((_, idx) => idx !== 0 && (
            <div
              key={idx}
              data-test-marc-subfield-row={idx}
            >
              <MARCTableViewRow
                rowData={getRowData(idx)}
                columnWidths={columnWidths}
                isSubline
              />
            </div>
          ))
        }
      </div>
    );
  };

  return fields.map(renderRow);
};

MARCTableViewRowContainer.propTypes = {
  fields: PropTypes.arrayOf(mappingMARCFieldShape.isRequired).isRequired,
  columnWidths: PropTypes.object.isRequired,
};
