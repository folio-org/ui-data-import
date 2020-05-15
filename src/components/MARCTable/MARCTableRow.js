import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
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
  intl,
}) => {
  const {
    allowedSubactions,
    allowedPositions,
    hasDataField,
  } = MARC_TABLE_CONFIG;

  const [actionValue, setActionValue] = useState('');
  const [subactionValue, setSubactionValue] = useState('');
  const [dataValue, setDataValue] = useState({});
  const [positionValue, setPositionValue] = useState('');

  const rowSubactions = allowedSubactions[actionValue] || [];
  const rowPositions = allowedPositions[actionValue] || {};
  const rowHasDataField = hasDataField[actionValue];

  useEffect(() => {
    setActionValue(field.action);
  }, [field.action]);

  useEffect(() => {
    setSubactionValue(field.subaction);
  }, [field.subaction]);

  useEffect(() => {
    setDataValue(field.data);
  }, [field.data]);

  useEffect(() => {
    setPositionValue(field.position);
  }, [field.position]);

  const onSelectChange = ({ target: { value } }, callback) => {
    callback(value);
  };
  const onActionChange = ({ target: { value } }) => {
    setActionValue(value);
    setSubactionValue('');
  };

  const onDataChange = useCallback(
    ({ target: { value } }, key) => {
      setDataValue({
        ...dataValue,
        [key]: value,
      });
    },
    [dataValue],
  );

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
            value={actionValue}
            onChange={onActionChange}
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
          marginBottom0
        />
      </div>
    );
  };
  const renderInd1Field = () => {
    const cellStyle = { width: columnWidths.indicator1 };

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-in1
        className={css.tableCell}
        style={cellStyle}
      >
        <TextField
          value={field.indicator1 || ''}
          marginBottom0
        />
      </div>
    );
  };
  const renderInd2Field = () => {
    const cellStyle = { width: columnWidths.indicator2 };

    return (
      <div
        data-test-marc-table-cell
        data-test-marc-table-in2
        className={css.tableCell}
        style={cellStyle}
      >
        <TextField
          value={field.indicator2 || ''}
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
            value={subactionValue || ''}
            onChange={e => onSelectChange(e, setSubactionValue)}
            placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.placeholder.select' })}
            marginBottom0
          />
        )}
      </div>
    );
  };
  const renderDataField = () => {
    const EDIT_ACTION = 'EDIT';
    const MOVE_ACTION = 'MOVE';
    const REPLACE_SUBACTION = 'REPLACE';
    const NEW_SUBACTION = 'NEW';
    const EXISTING_SUBACTION = 'EXISTING';

    let cellStyle = {
      width: columnWidths.data,
      flexGrow: 1,
      justifyContent: 'space-between',
    };

    const getContent = () => {
      if (actionValue === EDIT_ACTION && subactionValue === REPLACE_SUBACTION) {
        cellStyle = {
          ...cellStyle,
          display: 'flex',
          'flex-direction': 'column',
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
                value={dataValue?.find || ''}
                onChange={e => onDataChange(e, 'find')}
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
                value={dataValue?.replace || ''}
                onChange={e => onDataChange(e, 'replace')}
                marginBottom0
                fullWidth
              />
            </div>
          </div>
        );
      }

      if (actionValue === MOVE_ACTION && (subactionValue === NEW_SUBACTION || EXISTING_SUBACTION)) {
        return (
          <>
            <TextField
              className={css.tableDataCell}
              value={dataValue?.field || ''}
              onChange={e => onDataChange(e, 'field')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.field' })}
              marginBottom0
            />
            <TextField
              className={css.tableDataCell}
              value={dataValue?.indicator1 || ''}
              onChange={e => onDataChange(e, 'indicator1')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.in1' })}
              marginBottom0
            />
            <TextField
              className={css.tableDataCell}
              value={dataValue?.indicator2 || ''}
              onChange={e => onDataChange(e, 'indicator2')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.in2' })}
              marginBottom0
            />
            <TextField
              value={dataValue?.subfield || ''}
              onChange={e => onDataChange(e, 'subfield')}
              placeholder={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subfield' })}
              marginBottom0
            />
          </>
        );
      }

      return (
        <TextArea
          value={dataValue?.text || ''}
          marginBottom0
          onChange={e => onDataChange(e, 'text')}
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
            value={positionValue}
            onChange={e => onSelectChange(e, setPositionValue)}
            marginBottom0
          />
        )}
      </div>
    );
  };
  const renderAddRemove = () => {
    const cellStyle = {
      width: columnWidths.addRemove,
      'justify-content': isSubline && 'flex-end',
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
          />
        )}
        <IconButton
          data-test-marc-table-remove
          icon="trash"
          ariaLabel={intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.deleteField' })}
        />
      </div>
    );
  };

  return (
    <div className={css.tableRow}>
      {renderArrows()}
      {renderActionField()}
      {renderTagField()}
      {renderInd1Field()}
      {renderInd2Field()}
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
  columnWidths: PropTypes.object,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  isSubline: PropTypes.bool,
};

MARCTableRow.defaultProps = {
  isFirst: false,
  isLast: false,
  isSubline: false,
};
