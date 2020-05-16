import React from 'react';
import { PropTypes } from 'prop-types';

import { isEmpty } from 'lodash';

import { MARCTableRow } from './MARCTableRow';

import css from './MARCTable.css';

export const MARCTableRowContainer = ({
  fields,
  columnWidths,
  intl,
}) => {
  const renderRow = (field, i) => {
    const containsSubsequentLines = !isEmpty(field.subfields);

    return (
      <div
        data-test-marc-table-row
        key={i}
        className={css.tableRowContainer}
      >
        <MARCTableRow
          field={field}
          columnWidths={columnWidths}
          isFirst={i === 0}
          isLast={i === (fields.length - 1)}
          intl={intl}
        />
        {containsSubsequentLines &&
          field.subfields.map(subfield => (
            <div>
              <MARCTableRow
                field={subfield}
                columnWidths={columnWidths}
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
  columnWidths: PropTypes.object,
};
