import React from 'react';
import { PropTypes } from 'prop-types';

import { MARCTableRow } from './MARCTableRow';

import {
  mappingMARCFieldShape,
  marcFieldProtectionSettingsShape,
} from '../../utils';

import css from './MARCTable.css';

export const MARCTableRowContainer = ({
  columns,
  fields,
  columnWidths,
  onFieldUpdate,
  isMarcFieldProtectionSettings,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  onAddSubfieldRow,
  onRemoveSubfieldRow,
  removeSubfieldRows,
  removePositionFromRow,
  removeSubactionFromRow,
  removeDataValuesFromRow,
  onUpdateMappingProtectedField,
}) => {
  const renderRow = (data, i) => {
    const subfieldsData = data.field?.subfields;
    const containsSubsequentLines = subfieldsData?.length > 1;
    const name = `profile.mappingDetails.marcMappingDetails[${i}]`;

    const fieldData = isMarcFieldProtectionSettings ? data.field : data.field?.field;
    const indicator1Data = isMarcFieldProtectionSettings ? data.indicator1 : data.field?.indicator1;
    const indicator2Data = isMarcFieldProtectionSettings ? data.indicator2 : data.field?.indicator2;
    const dataColumnData = isMarcFieldProtectionSettings ? data.data : subfieldsData?.[0]?.data;
    const subfieldData = isMarcFieldProtectionSettings ? data.subfield : subfieldsData?.[0]?.subfield;

    return (
      <div
        data-testid="marc-table-row"
        key={i}
        className={css.tableRowContainer}
      >
        <MARCTableRow
          columns={columns}
          name={name}
          rowData={data}
          order={data.order}
          action={data.action}
          field={fieldData}
          indicator1={indicator1Data}
          indicator2={indicator2Data}
          subaction={subfieldsData?.[0]?.subaction}
          data={dataColumnData}
          subfield={subfieldData}
          override={data.override}
          columnWidths={columnWidths}
          isMarcFieldProtectionSettings={isMarcFieldProtectionSettings}
          rowIndex={i}
          isFirst={i === 0}
          isLast={i === (fields.length - 1)}
          subfieldIndex={0}
          onFieldUpdate={onFieldUpdate}
          onAddNewRow={onAddNewRow}
          onRemoveRow={onRemoveRow}
          onMoveRow={onMoveRow}
          onAddSubfieldRow={onAddSubfieldRow}
          onRemoveSubfieldRow={onRemoveSubfieldRow}
          removeSubfieldRows={removeSubfieldRows}
          removePositionFromRow={removePositionFromRow}
          removeSubactionFromRow={removeSubactionFromRow}
          removeDataValuesFromRow={removeDataValuesFromRow}
          onUpdateMappingProtectedField={onUpdateMappingProtectedField}
        />
        {containsSubsequentLines &&
          data.field.subfields.map((subfield, idx) => idx !== 0 && (
            <div
              key={idx}
              data-testid="marc-table-subfield-row"
              data-test-marc-subfield-row={idx}
            >
              <MARCTableRow
                columns={columns}
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
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.oneOfType([
      mappingMARCFieldShape.isRequired,
      marcFieldProtectionSettingsShape.isRequired,
    ]),
  ).isRequired,
  columnWidths: PropTypes.object.isRequired,
  isMarcFieldProtectionSettings: PropTypes.bool.isRequired,
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
  onUpdateMappingProtectedField: PropTypes.func.isRequired,
};
