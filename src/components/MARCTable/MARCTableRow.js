import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
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
  validateRequiredField,
  validateMarcTagField,
  validateMarcIndicatorField,
  validateSubfieldField,
  validateAlphanumericOrAllowedValue,
} from '../../utils';

import css from './MARCTable.css';

export const MARCTableRow = ({
  name,
  order,
  action,
  subaction,
  field,
  indicator1,
  indicator2,
  columnWidths,
  isFirst,
  isLast,
  isSubline,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  subfieldIndex,
  subfieldsData,
  onAddSubfieldRow,
  onRemoveSubfieldRow,
  onRemoveSubfieldRows,
  onDeleteActionSelect,
}) => {
  const {
    allowedSubactions,
    allowedPositions,
    hasDataField,
  } = MARC_TABLE_CONFIG;

  const {
    ADD,
    DELETE,
    EDIT,
    MOVE,
  } = MAPPING_DETAILS_ACTIONS;

  const { formatMessage } = useIntl();
  const [actionValue, setActionValue] = useState('');
  const [subactionValue, setSubactionValue] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [indicator1Value, setIndicator1Value] = useState('');
  const [indicator2Value, setIndicator2Value] = useState('');

  useEffect(() => {
    setActionValue(action);
  }, [action]);
  useEffect(() => {
    setSubactionValue(subaction);
  }, [subaction]);
  useEffect(() => {
    setFieldValue(field);
  }, [field]);
  useEffect(() => {
    setIndicator1Value(indicator1);
  }, [indicator1]);
  useEffect(() => {
    setIndicator2Value(indicator2);
  }, [indicator2]);

  const rowSubactions = allowedSubactions[actionValue] || [];
  const rowPositions = allowedPositions[actionValue] || {};
  const rowHasDataField = hasDataField[actionValue];

  const validateTag = useCallback(
    value => {
      if (actionValue === ADD || actionValue === DELETE) {
        return validateMarcTagField(indicator1Value, indicator2Value)(value) || validateRequiredField(value);
      }

      return null;
    },
    [actionValue, indicator1Value, indicator2Value, ADD, DELETE],
  );
  const validateIndicator1 = useCallback(
    value => {
      if (actionValue === ADD) {
        return validateAlphanumericOrAllowedValue(value) || validateMarcIndicatorField(fieldValue, value, indicator2Value);
      }

      if (actionValue === DELETE) {
        return validateAlphanumericOrAllowedValue(value, '*') || validateMarcIndicatorField(fieldValue, value, indicator2Value);
      }

      return null;
    },
    [actionValue, fieldValue, indicator2Value, ADD, DELETE],
  );
  const validateIndicator2 = useCallback(
    value => {
      if (actionValue === ADD) {
        return validateAlphanumericOrAllowedValue(value) || validateMarcIndicatorField(fieldValue, indicator1Value, value);
      }

      if (actionValue === DELETE) {
        return validateAlphanumericOrAllowedValue(value, '*') || validateMarcIndicatorField(fieldValue, indicator1Value, value);
      }

      return null;
    },
    [actionValue, fieldValue, indicator1Value, ADD, DELETE],
  );
  const validateSubfield = useCallback(
    value => {
      if (actionValue === ADD) {
        return validateAlphanumericOrAllowedValue(value) || validateSubfieldField(fieldValue)(value);
      }

      if (actionValue === DELETE) {
        return validateRequiredField(value) || validateAlphanumericOrAllowedValue(value, '*') || validateSubfieldField(fieldValue)(value);
      }

      return null;
    },
    [actionValue, fieldValue, ADD, DELETE],
  );

  const handleActionChange = e => {
    const selectedAction = e.target.value;

    setActionValue(selectedAction);

    if (selectedAction !== ADD && subfieldsData?.length > 1) {
      onRemoveSubfieldRows(order);
    }

    if (selectedAction === DELETE) {
      onDeleteActionSelect(order, ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*');
    }
  };

  const handleSubActionChange = e => {
    const { ADD_SUBFIELD } = MAPPING_DETAILS_SUBACTIONS;

    setSubactionValue(e.target.value);

    if (e.target.value === ADD_SUBFIELD) {
      onAddSubfieldRow(order);
    }
  };

  const handleRemoveRow = () => (!isSubline ? onRemoveRow(order) : onRemoveSubfieldRow(order, subfieldIndex));
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
          <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.moveUpRow">
            {ariaLabel => (
              <IconButton
                data-test-marc-table-arrow-up
                icon="arrow-up"
                ariaLabel={ariaLabel}
                onClick={() => onMoveRow(order, order - 1)}
              />
            )}
          </FormattedMessage>
        )}
        {withRowDown && (
          <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.moveDownRow">
            {ariaLabel => (
              <IconButton
                data-test-marc-table-arrow-down
                icon="arrow-down"
                ariaLabel={ariaLabel}
                onClick={() => onMoveRow(order, order + 1)}
              />
            )}
          </FormattedMessage>
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
          <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.placeholder.select">
            {placeholder => (
              <Field
                name={`${name}.action`}
                component={Select}
                dataOptions={dataOptions}
                placeholder={placeholder}
                onChange={handleActionChange}
                validate={[validateRequiredField]}
                marginBottom0
              />
            )}
          </FormattedMessage>
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
          onChange={e => setFieldValue(e.target.value)}
          validate={[validateTag]}
          disabled={isSubline}
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
          onChange={setIndicator1Value}
          validate={[validateIndicator1]}
          disabled={isSubline}
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
          onChange={setIndicator2Value}
          validate={[validateIndicator2]}
          disabled={isSubline}
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
          validate={[validateSubfield]}
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
          <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.placeholder.select">
            {placeholder => (
              <Field
                name={`${name}.field.subfields[${subfieldIndex}].subaction`}
                component={Select}
                dataOptions={dataOptions}
                placeholder={placeholder}
                onChange={handleSubActionChange}
                marginBottom0
              />
            )}
          </FormattedMessage>
        )}
      </div>
    );
  };
  const renderDataField = () => {
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
                <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.data.find" />
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
                <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.data.replace" />
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
            <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.field">
              {placeholder => (
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.field`}
                  component={TextField}
                  className={css.tableDataCell}
                  placeholder={placeholder}
                  marginBottom0
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.indicator1">
              {placeholder => (
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.indicator1`}
                  component={TextField}
                  className={css.tableDataCell}
                  placeholder={placeholder}
                  marginBottom0
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.indicator2">
              {placeholder => (
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.indicator2`}
                  component={TextField}
                  className={css.tableDataCell}
                  placeholder={placeholder}
                  marginBottom0
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.subfield">
              {placeholder => (
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.subfields[${subfieldIndex}].subfield`}
                  component={TextField}
                  className={css.tableDataCell}
                  placeholder={placeholder}
                  marginBottom0
                />
              )}
            </FormattedMessage>
          </>
        );
      }

      return (
        <div data-test-marc-table-data-text>
          <Field
            name={`${name}.field.subfields[${subfieldIndex}].data.text`}
            component={TextArea}
            validate={[validateRequiredField]}
            marginBottom0
          />
        </div>
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
          <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.addField">
            {ariaLabel => (
              <IconButton
                data-test-marc-table-add
                icon="plus-sign"
                ariaLabel={ariaLabel}
                onClick={() => onAddNewRow(order + 1)}
              />
            )}
          </FormattedMessage>
        )}
        <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.deleteField">
          {ariaLabel => (
            <IconButton
              data-test-marc-table-remove
              className={css.removeButton}
              icon="trash"
              disabled={isSingle}
              ariaLabel={ariaLabel}
              onClick={handleRemoveRow}
            />
          )}
        </FormattedMessage>
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
  onAddNewRow: PropTypes.func,
  onRemoveRow: PropTypes.func,
  onMoveRow: PropTypes.func,
  action: PropTypes.string,
  subaction: PropTypes.string,
  field: PropTypes.string,
  indicator1: PropTypes.string,
  indicator2: PropTypes.string,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isSubline: PropTypes.bool,
  subfieldsData: PropTypes.arrayOf(PropTypes.shape({
    subfield: PropTypes.string,
    data: PropTypes.object,
    subaction: PropTypes.string,
  })),
  onAddSubfieldRow: PropTypes.func.isRequired,
  onRemoveSubfieldRow: PropTypes.func.isRequired,
  onRemoveSubfieldRows: PropTypes.func.isRequired,
  onDeleteActionSelect: PropTypes.func.isRequired,
};

MARCTableRow.defaultProps = {
  isFirst: false,
  isLast: false,
  isSubline: false,
  action: '',
  subaction: '',
  field: '',
  indicator1: '',
  indicator2: '',
  subfieldsData: [{}],
};
