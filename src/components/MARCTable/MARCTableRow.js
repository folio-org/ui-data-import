import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

// TODO: Wrap fields into <Field> component once BE be ready
export const MARCTableRow = ({
  field,
  columnWidths,
  isFirst,
  isLast,
  isSubline,
  onAddNewRow,
  onRemoveRow,
  onDataChange,
  intl,
}) => {
  const {
    allowedSubactions,
    allowedPositions,
    hasDataField,
  } = MARC_TABLE_CONFIG;

  const rowSubactions = allowedSubactions[field.action] || [];
  const rowPositions = allowedPositions[field.action] || {};
  const rowHasDataField = hasDataField[field.action];

  const onActionFieldChange = ({ target: { value } }) => {
    const updatedData = {
      ...field,
      action: value,
      subaction: '',
    };

    onDataChange(updatedData, field.order);
  };

  const onDataFieldChange = key => ({ target: { value } }) => {
    const updatedData = {
      ...field,
      data: {
        ...field.data,
        [key]: value,
      },
    };

    onDataChange(updatedData, field.order);
  };

  const onFieldChange = key => ({ target: { value } }) => {
    const updatedData = {
      ...field,
      [key]: value,
    };

    onDataChange(updatedData, field.order);
  };

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
            ariaLabel={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.moveUpRow' })}
          />
        )}
        {withRowDown && (
          <IconButton
            data-test-marc-table-arrow-down
            icon="arrow-down"
            ariaLabel={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.moveDownRow' })}
          />
        )}
      </div>
    );
  };
  const renderActionField = () => {
    const cellStyle = { width: columnWidths.action };

    const dataOptions = ACTION_OPTIONS.map(option => ({
      value: option.value,
      label: intl.formatMessage({ id: option.label }),
    }));

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-action
        className={css.tableCell}
        style={cellStyle}
      >
        {!isSubline && (
          <Select
            dataOptions={dataOptions}
            value={field.action || ''}
            onChange={onActionFieldChange}
            placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
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
        <TextField
          value={field.field || ''}
          onChange={onFieldChange('field')}
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
        <TextField
          value={field.indicator1 || ''}
          onChange={onFieldChange('indicator1')}
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
        <TextField
          value={field.indicator2 || ''}
          onChange={onFieldChange('indicator2')}
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
        <TextField
          value={field.subfield || ''}
          onChange={onFieldChange('subfield')}
          marginBottom0
        />
      </div>
    );
  };
  const renderSubactionField = () => {
    const getMatchedSubaction = option => rowSubactions.some(subaction => subaction === option.value);

    const cellStyle = { width: columnWidths.subaction };
    const allowedOptions = SUBACTION_OPTIONS.filter(getMatchedSubaction);
    const dataOptions = allowedOptions.map(option => ({
      value: option.value,
      label: intl.formatMessage({ id: option.label }),
    }));

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-subaction
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(dataOptions) && (
          <Select
            dataOptions={dataOptions}
            value={field.subaction || ''}
            onChange={onFieldChange('subaction')}
            placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
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
      if (field.action === EDIT && field.subaction === REPLACE) {
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
              <TextArea
                value={field.data?.find || ''}
                onChange={onDataFieldChange('find')}
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
              <TextArea
                value={field.data?.replace || ''}
                onChange={onDataFieldChange('replace')}
                marginBottom0
                fullWidth
              />
            </div>
          </div>
        );
      }

      if (field.action === MOVE && (field.subaction === NEW_FIELD || field.subaction === EXISTING_FIELD)) {
        return (
          <>
            <TextField
              className={css.tableDataCell}
              value={field.data?.field || ''}
              onChange={onDataFieldChange('field')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.field' })}
              marginBottom0
            />
            <TextField
              className={css.tableDataCell}
              value={field.data?.indicator1 || ''}
              onChange={onDataFieldChange('indicator1')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator1' })}
              marginBottom0
            />
            <TextField
              className={css.tableDataCell}
              value={field.data?.indicator2 || ''}
              onChange={onDataFieldChange('indicator2')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator2' })}
              marginBottom0
            />
            <TextField
              value={field.data?.subfield || ''}
              onChange={onDataFieldChange('subfield')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subfield' })}
              marginBottom0
            />
          </>
        );
      }

      return (
        <TextArea
          value={field.data?.text || ''}
          marginBottom0
          onChange={onDataFieldChange('text')}
        />
      );
    };

    return (
      <div
        data-test-marc-table-cell
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(field.action) && rowHasDataField && getContent()}
      </div>
    );
  };
  const renderPositionField = () => {
    const cellStyle = { width: columnWidths.position };
    const positions = rowPositions[field.subaction] || [];
    const getMatchedPositions = option => positions.some(position => position === option.value);

    const allowedOptions = POSITION_OPTIONS.filter(getMatchedPositions);
    const dataOptions = allowedOptions.map(option => ({
      value: option.value,
      label: intl.formatMessage({ id: option.label }),
    }));

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-position
        className={css.tableCell}
        style={cellStyle}
      >
        {!isEmpty(dataOptions) && (
          <Select
            dataOptions={dataOptions}
            value={field.position || ''}
            onChange={onFieldChange('position')}
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
            ariaLabel={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.addField' })}
            onClick={() => onAddNewRow(field.order + 1)}
          />
        )}
        <IconButton
          data-test-marc-table-remove
          icon="trash"
          disabled={isSingle}
          ariaLabel={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.deleteField' })}
          onClick={() => onRemoveRow(field.order)}
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
  intl: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  columnWidths: PropTypes.object.isRequired,
  onAddNewRow: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isSubline: PropTypes.bool,
};

MARCTableRow.defaultProps = {
  isFirst: false,
  isLast: false,
  isSubline: false,
};
