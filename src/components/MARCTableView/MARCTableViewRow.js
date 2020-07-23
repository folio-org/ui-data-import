import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { isEmpty } from 'lodash';

import {
  MAPPING_DETAILS_ACTIONS,
  MAPPING_DETAILS_SUBACTIONS,
  ACTION_OPTIONS,
  SUBACTION_OPTIONS,
  POSITION_OPTIONS,
  mappingMARCViewFieldShape,
} from '../../utils';

import css from '../MARCTable/MARCTable.css';

export const MARCTableViewRow = ({
  rowData,
  columnWidths,
  isSubline,
}) => {
  const {
    REPLACE,
    NEW_FIELD,
    EXISTING_FIELD,
  } = MAPPING_DETAILS_SUBACTIONS;

  const {
    EDIT,
    MOVE,
  } = MAPPING_DETAILS_ACTIONS;

  const {
    action,
    subaction,
  } = rowData;

  const renderCell = (key, i) => {
    const cellData = rowData[key];
    const cellStyle = { width: columnWidths[key] };

    const getCellContent = () => {
      const actionField = ACTION_OPTIONS.find(option => option.value === cellData);
      const subactionField = SUBACTION_OPTIONS.find(option => option.value === cellData);
      const positionField = POSITION_OPTIONS.find(option => option.value === cellData);
      const isDataField = key === 'data';

      if (actionField) {
        return !isSubline && <FormattedMessage id={actionField?.label} />;
      }

      if (subactionField) {
        return <FormattedMessage id={subactionField?.label} />;
      }

      if (positionField) {
        return <FormattedMessage id={positionField?.label} />;
      }

      if (isDataField) {
        if (action === EDIT && subaction === REPLACE) {
          const innerCellStyle = {
            display: 'flex',
            flexDirection: 'column',
          };

          const findContainerStyle = {
            display: 'flex',
            marginBottom: '5px',
          };

          return (
            <div style={innerCellStyle}>
              <div
                data-test-marc-table-view-data-find
                style={findContainerStyle}
              >
                <span className={css.tableViewLabel}>
                  <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.data.find" />
                </span>
                {cellData.find}
              </div>
              <div
                data-test-marc-table-view-data-replace
                style={{ display: 'flex' }}
              >
                <span className={css.tableViewLabel}>
                  <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.data.replace" />
                </span>
                {cellData.replaceWith}
              </div>
            </div>
          );
        }

        if (action === MOVE) {
          const innerCellStyle = {
            width: '20%',
            paddingRight: '5px',
          };

          if (subaction === NEW_FIELD || subaction === EXISTING_FIELD) {
            return (
              <>
                <div
                  data-test-marc-table-view-data-field
                  style={innerCellStyle}
                >
                  {cellData.marcField?.field}
                </div>
                <div
                  data-test-marc-table-view-data-indicator1
                  style={innerCellStyle}
                >
                  <span className={css.tableViewLabel}>
                    <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.indicator1" />:
                  </span>
                  {cellData.marcField?.indicator1}
                </div>
                <div
                  style={innerCellStyle}
                  data-test-marc-table-view-data-indicator2
                >
                  <span className={css.tableViewLabel}>
                    <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.indicator2" />:
                  </span>
                  {cellData.marcField?.indicator2}
                </div>
                <div
                  data-test-marc-table-view-data-subfield
                  style={{
                    ...innerCellStyle,
                    width: '40%',
                  }}
                >
                  <span className={css.tableViewLabel}>
                    <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.subfield" />:
                  </span>
                  {cellData.marcField?.subfields[0]?.subfield}
                </div>
              </>
            );
          }
        }

        return cellData.text || '';
      }

      return cellData;
    };

    return (
      <div
        key={i}
        data-test-marc-table-view-cell
        data-test-marc-table-view={key}
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(cellData) && getCellContent()}
      </div>
    );
  };

  return (
    <div className={css.tableRow}>
      {Object.keys(rowData).map((key, i) => renderCell(key, i))}
    </div>
  );
};

MARCTableViewRow.propTypes = {
  rowData: mappingMARCViewFieldShape,
  columnWidths: PropTypes.object.isRequired,
  isSubline: PropTypes.bool,
};

MARCTableViewRow.defaultProps = { isSubline: false };
