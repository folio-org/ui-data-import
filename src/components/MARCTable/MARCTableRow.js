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
  validateMoveField,
  mappingMARCFieldShape,
  mappingMARCDataShape,
} from '../../utils';

import css from './MARCTable.css';

export const MARCTableRow = ({
  name,
  rowData,
  order,
  action,
  subaction,
  field,
  indicator1,
  indicator2,
  data,
  columnWidths,
  isFirst,
  isLast,
  isSubline,
  onFieldUpdate,
  onAddNewRow,
  onRemoveRow,
  onMoveRow,
  subfieldIndex,
  onAddSubfieldRow,
  onRemoveSubfieldRow,
  removeSubfieldRows,
  removePositionFromRow,
  removeSubactionFromRow,
  removeDataValuesFromRow,
  fillEmptyFieldsWithValue,
}) => {
  const {
    allowedSubactions,
    allowedPositions,
    hasDataField,
  } = MARC_TABLE_CONFIG;
  const {
    REPLACE,
    NEW_FIELD,
    EXISTING_FIELD,
  } = MAPPING_DETAILS_SUBACTIONS;

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
  const [dataValue, setDataValue] = useState({});

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
  useEffect(() => {
    setDataValue({ ...data });
  }, [data]);

  const rowSubactions = allowedSubactions[actionValue] || [];
  const rowPositions = allowedPositions[actionValue] || {};
  const rowHasDataField = hasDataField[actionValue];

  const validateTag = useCallback(
    value => {
      return validateMarcTagField(indicator1Value, indicator2Value)(value) || validateRequiredField(value);
    },
    [indicator1Value, indicator2Value],
  );
  const validateIndicator1 = useCallback(
    value => {
      if (actionValue === ADD) {
        return validateAlphanumericOrAllowedValue(value) || validateMarcIndicatorField(fieldValue, value, indicator2Value);
      }

      return validateAlphanumericOrAllowedValue(value, '*') || validateMarcIndicatorField(fieldValue, value, indicator2Value);
    },
    [ADD, actionValue, fieldValue, indicator2Value],
  );
  const validateIndicator2 = useCallback(
    value => {
      if (actionValue === ADD) {
        return validateAlphanumericOrAllowedValue(value) || validateMarcIndicatorField(fieldValue, indicator1Value, value);
      }

      return validateAlphanumericOrAllowedValue(value, '*') || validateMarcIndicatorField(fieldValue, indicator1Value, value);
    },
    [ADD, actionValue, fieldValue, indicator1Value],
  );
  const validateSubfield = useCallback(
    value => {
      if (actionValue === ADD) {
        return validateAlphanumericOrAllowedValue(value) || validateSubfieldField(fieldValue)(value);
      }

      return validateAlphanumericOrAllowedValue(value, '*') || validateSubfieldField(fieldValue)(value);
    },
    [ADD, actionValue, fieldValue],
  );
  const validateSubaction = useCallback(
    value => {
      if (actionValue === MOVE || actionValue === EDIT) {
        return validateRequiredField(value);
      }

      return null;
    },
    [MOVE, EDIT, actionValue],
  );
  const validateDataField = useCallback(
    value => {
      return validateRequiredField(value) || validateMoveField(fieldValue)(value)
        || validateMarcTagField(dataValue?.marcField?.indicator1, dataValue?.marcField?.indicator2)(value);
    },
    [dataValue, fieldValue],
  );
  const validateDataIndicator1 = useCallback(
    value => {
      return validateAlphanumericOrAllowedValue(value, '*')
        || validateMarcIndicatorField(dataValue?.marcField?.field, value, dataValue?.marcField?.indicator2);
    },
    [dataValue],
  );
  const validateDataIndicator2 = useCallback(
    value => {
      return validateAlphanumericOrAllowedValue(value, '*')
        || validateMarcIndicatorField(dataValue?.marcField?.field, dataValue?.marcField?.indicator1, value);
    },
    [dataValue],
  );

  const validateDataSubfield = useCallback(
    value => {
      if (subactionValue === NEW_FIELD) {
        return validateAlphanumericOrAllowedValue(value, '*');
      }

      if (subactionValue === EXISTING_FIELD) {
        return validateRequiredField(value) || validateAlphanumericOrAllowedValue(value, '*');
      }

      return null;
    },
    [NEW_FIELD, EXISTING_FIELD, subactionValue],
  );

  const setDataFieldValue = (value, key) => {
    const updatedData = {
      ...dataValue,
      [key]: value,
    };

    setDataValue(updatedData);
  };

  const onAddActionSelect = () => {
    const rowWithoutSubaction = removeSubactionFromRow(rowData);
    const updatedField = removeDataValuesFromRow(rowWithoutSubaction);

    onFieldUpdate(order, updatedField);
  };
  const onDeleteActionSelect = () => {
    const rowWithoutSubfields = removeSubfieldRows(rowData);
    const rowWithoutData = removeDataValuesFromRow(rowWithoutSubfields);
    const updatedField = fillEmptyFieldsWithValue(rowWithoutData,
      ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*');

    onFieldUpdate(order, updatedField);
  };
  const onEditActionSelect = () => {
    const rowWithoutSubfields = removeSubfieldRows(rowData);
    const rowWithoutData = removeDataValuesFromRow(rowWithoutSubfields);
    const updatedField = fillEmptyFieldsWithValue(rowWithoutData,
      ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*');

    onFieldUpdate(order, updatedField);
  };
  const onMoveActionSelect = () => {
    const rowWithoutSubfields = removeSubfieldRows(rowData);
    const rowWithoutData = removeDataValuesFromRow(rowWithoutSubfields);
    const updatedField = fillEmptyFieldsWithValue(rowWithoutData,
      ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*');

    onFieldUpdate(order, updatedField);
  };

  const handleActionChange = e => {
    const selectedAction = e.target.value;

    setActionValue(selectedAction);

    if (selectedAction === ADD) {
      onAddActionSelect();
    }

    if (selectedAction === DELETE) {
      onDeleteActionSelect();
    }

    if (selectedAction === EDIT) {
      onEditActionSelect();
    }

    if (selectedAction === MOVE) {
      onMoveActionSelect();
    }
  };
  const handleSubActionChange = e => {
    const { ADD_SUBFIELD } = MAPPING_DETAILS_SUBACTIONS;

    setSubactionValue(e.target.value);

    if (e.target.value === ADD_SUBFIELD) {
      onAddSubfieldRow(order);
    }

    if (actionValue === EDIT) {
      const rowWithoutPosition = removePositionFromRow(rowData);
      const updatedField = removeDataValuesFromRow(rowWithoutPosition);

      onFieldUpdate(order, updatedField);
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
          <Field
            name={`${name}.action`}
            component={Select}
            dataOptions={dataOptions}
            placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
            onChange={handleActionChange}
            validate={[validateRequiredField]}
            aria-label={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.select' })}
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
          onChange={e => setFieldValue(e.target.value)}
          validate={[validateTag]}
          disabled={isSubline}
          ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.field' })}
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
          ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.indicator1' })}
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
          ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.indicator2' })}
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
          ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.subfield' })}
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
            onChange={handleSubActionChange}
            validate={[validateSubaction]}
            aria-label={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.subaction' })}
            marginBottom0
          />
        )}
      </div>
    );
  };
  const renderDataField = () => {
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
                aria-label={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.find' })}
                validate={[validateRequiredField]}
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
                aria-label={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.replaceWith' })}
                validate={[validateRequiredField]}
                marginBottom0
                fullWidth
              />
            </div>
          </div>
        );
      }

      if (actionValue === MOVE) {
        if (subactionValue === NEW_FIELD || subactionValue === EXISTING_FIELD) {
          return (
            <>
              <div data-test-marc-table-data-field>
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.field`}
                  component={TextField}
                  onChange={value => setDataFieldValue(value, 'field')}
                  className={css.tableDataCell}
                  placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.field' })}
                  ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.marcField.field' })}
                  validate={[validateDataField]}
                  marginBottom0
                />
              </div>
              <div data-test-marc-table-data-indicator1>
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.indicator1`}
                  component={TextField}
                  onChange={value => setDataFieldValue(value, 'indicator1')}
                  className={css.tableDataCell}
                  placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator1' })}
                  ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.marcField.indicator1' })}
                  validate={[validateDataIndicator1]}
                  marginBottom0
                />
              </div>
              <div data-test-marc-table-data-indicator2>
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.indicator2`}
                  component={TextField}
                  onChange={value => setDataFieldValue(value, 'indicator2')}
                  className={css.tableDataCell}
                  placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator2' })}
                  ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.marcField.indicator2' })}
                  validate={[validateDataIndicator2]}
                  marginBottom0
                />
              </div>
              <div data-test-marc-table-data-subfield>
                <Field
                  name={`${name}.field.subfields[${subfieldIndex}].data.marcField.subfields[${subfieldIndex}].subfield`}
                  component={TextField}
                  onChange={value => setDataFieldValue(value, 'subfield')}
                  className={css.tableDataCell}
                  placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subfield' })}
                  ariaLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.marcField.subfield' })}
                  validate={[validateDataSubfield]}
                  marginBottom0
                />
              </div>
            </>
          );
        }

        return null;
      }

      return (
        <div data-test-marc-table-data-text>
          <Field
            name={`${name}.field.subfields[${subfieldIndex}].data.text`}
            component={TextArea}
            validate={[validateRequiredField]}
            aria-label={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.data.text' })}
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
            placeholder={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
            aria-label={formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.ariaLabel.position' })}
            validate={[validateRequiredField]}
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
  onAddSubfieldRow: PropTypes.func.isRequired,
  onRemoveSubfieldRow: PropTypes.func.isRequired,
  rowData: mappingMARCFieldShape,
  onFieldUpdate: PropTypes.func,
  onAddNewRow: PropTypes.func,
  onRemoveRow: PropTypes.func,
  onMoveRow: PropTypes.func,
  action: PropTypes.string,
  data: mappingMARCDataShape,
  subaction: PropTypes.string,
  field: PropTypes.string,
  indicator1: PropTypes.string,
  indicator2: PropTypes.string,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isSubline: PropTypes.bool,
  removeSubfieldRows: PropTypes.func,
  removePositionFromRow: PropTypes.func,
  removeSubactionFromRow: PropTypes.func,
  removeDataValuesFromRow: PropTypes.func,
  fillEmptyFieldsWithValue: PropTypes.func,
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
};
