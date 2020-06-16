import React from 'react';
import { PropTypes } from 'prop-types';

import { MARCTableRow } from './MARCTableRow';

import css from './MARCTable.css';

export const MARCTableRowContainer = ({
  fields,
  columnWidths,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  onAddSubfieldRow,
  onRemoveSubfieldRow,
  onRemoveSubfieldRows,
  onDeleteActionSelect,
}) => {
  const renderRow = (data, i) => {
    const subfieldsData = data.field?.subfields;
    const containsSubsequentLines = subfieldsData?.length > 1;
    const name = `profile.mappingDetails.marcMappingDetails[${i}]`;

    return (
      <div
        data-test-marc-table-row={data.order}
        key={i}
        className={css.tableRowContainer}
      >
        <MARCTableRow
          name={name}
          order={data.order}
          action={data.action}
          subaction={subfieldsData?.[0]?.subaction}
          field={data.field?.field}
          indicator1={data.field?.indicator1}
          indicator2={data.field?.indicator2}
          columnWidths={columnWidths}
          isFirst={i === 0}
          isLast={i === (fields.length - 1)}
          onAddNewRow={onAddNewRow}
          onRemoveRow={onRemoveRow}
          onMoveRow={onMoveRow}
          subfieldIndex={0}
          subfieldsData={subfieldsData}
          onAddSubfieldRow={onAddSubfieldRow}
          onRemoveSubfieldRow={onRemoveSubfieldRow}
          onRemoveSubfieldRows={onRemoveSubfieldRows}
          onDeleteActionSelect={onDeleteActionSelect}
        />
        {containsSubsequentLines &&
          data.field.subfields.map((subfield, idx) => idx !== 0 && (
            <div
              key={idx}
              data-test-marc-subfield-row={idx}
            >
              <MARCTableRow
                name={name}
                order={data.order}
                action={data.action}
                subaction={subfield.subaction}
                field={subfield.field}
                indicator1={subfield.indicator1}
                indicator2={subfield.indicator2}
                columnWidths={columnWidths}
                isSubline
                subfieldIndex={idx}
                subfieldsData={subfieldsData}
                onAddSubfieldRow={onAddSubfieldRow}
                onRemoveSubfieldRow={onRemoveSubfieldRow}
                onRemoveSubfieldRows={onRemoveSubfieldRows}
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
  fields: PropTypes.arrayOf(PropTypes.object.isRequired),
  onAddNewRow: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
  onMoveRow: PropTypes.func.isRequired,
  columnWidths: PropTypes.object,
  onAddSubfieldRow: PropTypes.func.isRequired,
  onRemoveSubfieldRow: PropTypes.func.isRequired,
  onRemoveSubfieldRows: PropTypes.func.isRequired,
  onDeleteActionSelect: PropTypes.func.isRequired,
};
