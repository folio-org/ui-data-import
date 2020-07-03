import React from 'react';
import { PropTypes } from 'prop-types';

import { MARCTableRow } from './MARCTableRow';

import { mappingMARCFieldShape } from '../../utils';

import css from './MARCTable.css';

export const MARCTableRowContainer = ({
  fields,
  columnWidths,
  onFieldUpdate,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  onAddSubfieldRow,
  onRemoveSubfieldRow,
  removeSubfieldRows,
  removePositionFromRow,
  removeSubactionFromRow,
  removeDataValuesFromRow,
  fillEmptyFieldsWithValue,
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
          rowData={data}
          order={data.order}
          action={data.action}
          subaction={subfieldsData?.[0]?.subaction}
          field={data.field?.field}
          indicator1={data.field?.indicator1}
          indicator2={data.field?.indicator2}
          data={subfieldsData?.[0]?.data}
          columnWidths={columnWidths}
          isFirst={i === 0}
          isLast={i === (fields.length - 1)}
          onFieldUpdate={onFieldUpdate}
          onAddNewRow={onAddNewRow}
          onRemoveRow={onRemoveRow}
          onMoveRow={onMoveRow}
          subfieldIndex={0}
          subfieldsData={subfieldsData}
          onAddSubfieldRow={onAddSubfieldRow}
          onRemoveSubfieldRow={onRemoveSubfieldRow}
          removeSubfieldRows={removeSubfieldRows}
          removePositionFromRow={removePositionFromRow}
          removeSubactionFromRow={removeSubactionFromRow}
          removeDataValuesFromRow={removeDataValuesFromRow}
          fillEmptyFieldsWithValue={fillEmptyFieldsWithValue}
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
                data={subfield.data}
                columnWidths={columnWidths}
                isSubline
                subfieldIndex={idx}
                subfieldsData={subfieldsData}
                onAddSubfieldRow={onAddSubfieldRow}
                onRemoveSubfieldRow={onRemoveSubfieldRow}
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
  fields: PropTypes.arrayOf(mappingMARCFieldShape.isRequired).isRequired,
  columnWidths: PropTypes.object.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  onAddNewRow: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
  onMoveRow: PropTypes.func.isRequired,
  onAddSubfieldRow: PropTypes.func.isRequired,
  onRemoveSubfieldRow: PropTypes.func.isRequired,
  removeSubfieldRows: PropTypes.func.isRequired,
  removePositionFromRow: PropTypes.func.isRequired,
  removeSubactionFromRow: PropTypes.func.isRequired,
  removeDataValuesFromRow: PropTypes.func.isRequired,
  fillEmptyFieldsWithValue: PropTypes.func.isRequired,
};
