import React from 'react';
import { PropTypes } from 'prop-types';

import { isEmpty } from 'lodash';

import { MARCTableRow } from './MARCTableRow';

import css from './MARCTable.css';

export const MARCTableRowContainer = ({
  fields,
  columnWidths,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  onDataChange,
  intl,
}) => {
  const renderRow = (field, i) => {
    const containsSubsequentLines = !isEmpty(field.subfields);

    return (
      <div
        data-test-marc-table-row={field.order}
        key={i}
        className={css.tableRowContainer}
      >
        <MARCTableRow
          field={field}
          columnWidths={columnWidths}
          isFirst={i === 0}
          isLast={i === (fields.length - 1)}
          onAddNewRow={onAddNewRow}
          onRemoveRow={onRemoveRow}
          onMoveRow={onMoveRow}
          onDataChange={onDataChange}
          intl={intl}
        />
        {containsSubsequentLines &&
          field.subfields.map(subfield => (
            <div>
              <MARCTableRow
                field={subfield}
                columnWidths={columnWidths}
                onDataChange={onDataChange}
                isSubline
                intl={intl}
              />
            </div>
          ))
        }
      </div>
    );
  };

  return fields.map(renderRow);
};

MARCTableRowContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object.isRequired),
  onAddNewRow: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
  onMoveRow: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  columnWidths: PropTypes.object,
};
