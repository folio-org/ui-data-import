import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';

import { isEmpty } from 'lodash';

import {
  Select,
  TextField,
  TextArea,
  IconButton,
  Label,
} from '@folio/stripes/components';

import {
  MAPPING_DETAILS_ACTIONS,
  MAPPING_DETAILS_SUBACTIONS,
  ACTION_OPTIONS,
  SUBACTION_OPTIONS,
  POSITION_OPTIONS,
  MARC_TABLE_CONFIG,
} from '../../utils';

import css from './MARCTable.css';

export const MARCTableRow = ({
  name,
  order,
  action,
  subaction,
  columnWidths,
  isFirst,
  isLast,
  isSubline,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  subfieldIndex,
}) => {
  const {
    allowedSubactions,
    allowedPositions,
    hasDataField,
  } = MARC_TABLE_CONFIG;

  const { formatMessage } = useIntl();
  const [actionValue, setActionValue] = useState(action);
  const [subactionValue, setSubactionValue] = useState(subaction);

  const rowSubactions = allowedSubactions[actionValue] || [];
  const rowPositions = allowedPositions[actionValue] || {};
  const rowHasDataField = hasDataField[actionValue];

  const renderArrows = () => {
    const cellStyle = {
      width: columnWidths.arrows,
      justifyContent: isFirst ? 'flex-end' : 'flex-start',
    };

    const withRowUp = !isSubline && !isFirst;
    const withRowDown = !isSubline && !isLast;

    return (
      <div
        data-test-marc-table-cell
        className={css.tableCell}
        style={cellStyle}
      >
        {withRowUp && (
          <IconButton
            data-test-marc-table-arrow-up
            icon="arrow-up"
            ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.moveUpRow' })}
            onClick={() => onMoveRow(order, order - 1)}
          />
        )}
        {withRowDown && (
          <IconButton
            data-test-marc-table-arrow-down
            icon="arrow-down"
            ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.moveDownRow' })}
            onClick={() => onMoveRow(order, order + 1)}
          />
        )}
      </div>
    );
  };
  const renderActionField = () => {
    const cellStyle = { width: columnWidths.action };

    const dataOptions = ACTION_OPTIONS.map(option => ({
      value: option.value,
      label: formatMessage({ id: option.label }),
    }));

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-action
        className={css.tableCell}
        style={cellStyle}
      >
        {!isSubline && (
          <Field
            name={`${name}.action`}
            component={Select}
            dataOptions={dataOptions}
            placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
            onChange={e => setActionValue(e.target.value)}
            marginBottom0
          />
        )}
      </div>
    );
  };
  const renderTagField = () => {
    const cellStyle = { width: columnWidths.field };

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-tag
        className={css.tableCell}
        style={cellStyle}
      >
        <Field
          name={`${name}.field.field`}
          component={TextField}
          marginBottom0
        />
      </div>
    );
  };
  const renderIndicator1Field = () => {
    const cellStyle = { width: columnWidths.indicator1 };

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-indicator1
        className={css.tableCell}
        style={cellStyle}
      >
        <Field
          name={`${name}.field.indicator1`}
          component={TextField}
          marginBottom0
        />
      </div>
    );
  };
  const renderIndicator2Field = () => {
    const cellStyle = { width: columnWidths.indicator2 };

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-indicator2
        className={css.tableCell}
        style={cellStyle}
      >
        <Field
          name={`${name}.field.indicator2`}
          component={TextField}
          marginBottom0
        />
      </div>
    );
  };
  const renderSubfieldField = () => {
    const cellStyle = { width: columnWidths.subfield };

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-subfield
        className={css.tableCell}
        style={cellStyle}
      >
        <Field
          name={`${name}.field.subfields[${subfieldIndex}].subfield`}
          component={TextField}
          marginBottom0
        />
      </div>
    );
  };
  const renderSubactionField = () => {
    const getMatchedSubaction = option => rowSubactions.some(item => item === option.value);

    const cellStyle = { width: columnWidths.subaction };
    const allowedOptions = SUBACTION_OPTIONS.filter(getMatchedSubaction);
    const dataOptions = allowedOptions.map(option => ({
      value: option.value,
      label: formatMessage({ id: option.label }),
    }));

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-subaction
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(dataOptions) && (
          <Field
            name={`${name}.field.subfields[${subfieldIndex}].subaction`}
            component={Select}
            dataOptions={dataOptions}
            placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
            onChange={e => setSubactionValue(e.target.value)}
            marginBottom0
          />
        )}
      </div>
    );
  };
  const renderDataField = () => {
    const {
      EDIT,
      MOVE,
    } = MAPPING_DETAILS_ACTIONS;
    const {
      REPLACE,
      NEW_FIELD,
      EXISTING_FIELD,
    } = MAPPING_DETAILS_SUBACTIONS;

    let cellStyle = {
      width: columnWidths.data,
      flexGrow: 1,
      justifyContent: 'space-between',
    };

    const getContent = () => {
      if (actionValue === EDIT && subactionValue === REPLACE) {
        cellStyle = {
          ...cellStyle,
          display: 'flex',
          flexDirection: 'column',
        };
        const labelStyle = {
          marginRight: '10px',
          fontWeight: '400',
          whiteSpace: 'nowrap',
        };

        const findContainerStyle = {
          display: 'flex',
          marginBottom: '10px',
        };

        return (
          <div style={cellStyle}>
            <div
              data-test-marc-table-data-find
              style={findContainerStyle}
            >
              <Label style={labelStyle}>
                {formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.data.find' })}
              </Label>
              <Field
                name={`${name}.field.subfields[${subfieldIndex}].data.find`}
                component={TextArea}
                marginBottom0
                fullWidth
              />
            </div>
            <div
              data-test-marc-table-data-replace
              style={{ display: 'flex' }}
            >
              <Label style={labelStyle}>
                {formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.data.replace' })}
              </Label>
              <Field
                name={`${name}.field.subfields[${subfieldIndex}].data.replaceWith`}
                component={TextArea}
                marginBottom0
                fullWidth
              />
            </div>
          </div>
        );
      }

      if (actionValue === MOVE && (subactionValue === NEW_FIELD || subactionValue === EXISTING_FIELD)) {
        return (
          <>
            <Field
              name={`${name}.field.subfields[${subfieldIndex}].data.marcField.field`}
              component={TextField}
              className={css.tableDataCell}
              placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.field' })}
              marginBottom0
            />
            <Field
              name={`${name}.field.subfields[${subfieldIndex}].data.marcField.indicator1`}
              component={TextField}
              className={css.tableDataCell}
              placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator1' })}
              marginBottom0
            />
            <Field
              name={`${name}.field.subfields[${subfieldIndex}].data.marcField.indicator2`}
              component={TextField}
              className={css.tableDataCell}
              placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator2' })}
              marginBottom0
            />
            <Field
              name={`${name}.field.subfields[${subfieldIndex}].data.marcField.subfields[${subfieldIndex}].subfield`}
              component={TextField}
              className={css.tableDataCell}
              placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subfield' })}
              marginBottom0
            />
          </>
        );
      }

      return (
        <Field
          name={`${name}.field.subfields[${subfieldIndex}].data.text`}
          component={TextArea}
          marginBottom0
        />
      );
    };

    return (
      <div
        data-test-marc-table-cell
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(actionValue) && rowHasDataField && getContent()}
      </div>
    );
  };
  const renderPositionField = () => {
    const cellStyle = { width: columnWidths.position };
    const positions = rowPositions[subactionValue] || [];
    const getMatchedPositions = option => positions.some(position => position === option.value);

    const allowedOptions = POSITION_OPTIONS.filter(getMatchedPositions);
    const dataOptions = allowedOptions.map(option => ({
      value: option.value,
      label: formatMessage({ id: option.label }),
    }));

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-position
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(dataOptions) && (
          <Field
            name={`${name}.field.subfields[${subfieldIndex}].position`}
            component={Select}
            dataOptions={dataOptions}
            marginBottom0
          />
        )}
      </div>
    );
  };
  const renderAddRemove = () => {
    const isSingle = isFirst && isLast;
    const cellStyle = {
      width: columnWidths.addRemove,
      justifyContent: isSubline && 'flex-end',
    };

    return (
      <div
        data-test-marc-table-cell
        className={css.tableCell}
        style={cellStyle}
      >
        {!isSubline && (
          <IconButton
            data-test-marc-table-add
            icon="plus-sign"
            ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.addField' })}
            onClick={() => onAddNewRow(order + 1)}
          />
        )}
        <IconButton
          data-test-marc-table-remove
          className={css.removeButton}
          icon="trash"
          disabled={isSingle}
          ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.deleteField' })}
          onClick={() => onRemoveRow(order)}
        />
      </div>
    );
  };

  return (
    <div className={css.tableRow}>
      {renderArrows()}
      {renderActionField()}
      {renderTagField()}
      {renderIndicator1Field()}
      {renderIndicator2Field()}
      {renderSubfieldField()}
      {renderSubactionField()}
      {renderDataField()}
      {renderPositionField()}
      {renderAddRemove()}
    </div>
  );
};

MARCTableRow.propTypes = {
  subfieldIndex: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnWidths: PropTypes.object.isRequired,
  onAddNewRow: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
  onMoveRow: PropTypes.func.isRequired,
  action: PropTypes.string,
  subaction: PropTypes.string,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isSubline: PropTypes.bool,
};

MARCTableRow.defaultProps = {
  isFirst: false,
  isLast: false,
  isSubline: false,
  action: '',
  subaction: '',
};
