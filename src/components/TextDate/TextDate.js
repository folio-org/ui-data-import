import React, {
  useRef,
  useState,
} from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { contains } from 'dom-helpers';
import {
  pick,
  uniqueId,
} from 'lodash';

import {
  Calendar,
  IconButton,
  Popper,
  RootCloseWrapper,
  TextField,
} from '@folio/stripes/components';

import { AVAILABLE_PLACEMENTS } from '../../utils';

import css from './TextDate.css';

const pickDataProps = props => pick(props, (v, key) => key.indexOf('data-test') !== -1);

const propTypes = {
  autoFocus: PropTypes.bool,
  date: PropTypes.object,
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  exclude: PropTypes.func,
  hideOnChoose: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  inputRef: PropTypes.object,
  intl: PropTypes.object,
  label: PropTypes.node,
  locale: PropTypes.string,
  meta: PropTypes.object,
  modifiers: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSetDate: PropTypes.func,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  showCalendar: PropTypes.bool,
  useInput: PropTypes.bool,
  usePortal: PropTypes.bool,
  value: PropTypes.string,
};

const defaultProps = {
  autoFocus: false,
  hideOnChoose: true,
  modifiers: {},
  placement: 'bottom',
};

/**
 * This component is similar to the stripes <Datepicker> except that it allows to enter any text
 * to the input field.
 */
const TextDateField = ({
  disabled,
  dateFormat,
  exclude,
  hideOnChoose,
  id,
  intl,
  inputRef,
  locale,
  modifiers,
  onBlur,
  onFocus,
  onChange,
  placement,
  readOnly,
  showCalendar: showCalendarProp,
  usePortal,
  onSetDate,
  value: valueProp,
  ...props
}) => {
  const format = useRef(dateFormat).current;
  const [dateString, setDateString] = useState('');
  const [showCalendar, setShowCalendar] = useState(showCalendarProp);

  const pickerRef = useRef(null);
  const testId = useRef(id || uniqueId('dp-')).current;
  const calendarFirstField = useRef(null);
  const container = useRef(null);

  const setFromCalendar = value => {
    setDateString(value);
    onSetDate(value);
    if (hideOnChoose) {
      setShowCalendar(false);
    }
  };

  const datePickerIsFocused = () => {
    if (contains(container.current, document.activeElement) &&
      document.activeElement !== document.body) {
      if (pickerRef.current) {
        return (contains(pickerRef.current, document.activeElement));
      }

      return true;
    }

    return false;
  };

  const internalClearDate = () => {
    onChange('');
  };

  const toggleCalendar = () => {
    setShowCalendar(cur => !cur);
  };

  const handleInternalFocus = e => {
    onChange(valueProp);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleRootClose = e => {
    if (!contains(container.current, e.target) || !contains(pickerRef.current, e.target)) {
      if (!datePickerIsFocused()) {
        setShowCalendar(false);
      }
    }
  };

  const handleRequestClose = () => {
    inputRef.current?.focus(); // eslint-disable-line no-unused-expressions
    setShowCalendar(false);
  };

  const renderCalendar = () => (
    <RootCloseWrapper
      onRootClose={handleRootClose}
      ref={pickerRef}
    >
      <Calendar
        onSetDate={setFromCalendar}
        selectedDate={dateString}
        dateFormat={format}
        firstFieldRef={calendarFirstField}
        onFocus={handleInternalFocus}
        onRequestClose={handleRequestClose}
        rootRef={pickerRef}
        locale={locale || intl.locale}
        exclude={exclude}
        id={testId}
      />
    </RootCloseWrapper>
  );

  // renders clear button and calendar button
  const renderEndElement = () => {
    if (readOnly || disabled) return null;

    return (
      <>
        { valueProp && (
          <FormattedMessage id="stripes-components.clearFieldValue">
            {([ariaLabel]) => (
              <IconButton
                data-test-clear
                key="clearButton"
                onClick={internalClearDate}
                aria-label={ariaLabel}
                id={`datepicker-clear-button-${testId}`}
                tabIndex="-1"
                icon="times-circle-solid"
              />
            )}
          </FormattedMessage>
        )}
        <FormattedMessage id="stripes-components.showOrHideDatepicker">
          {([ariaLabel]) => (
            <IconButton
              data-test-calendar-button
              onClick={toggleCalendar}
              aria-label={ariaLabel}
              aria-haspopup="true"
              aria-expanded={!!showCalendar}
              id={`datepicker-toggle-calendar-button-${testId}`}
              icon="calendar"
            />
          )}
        </FormattedMessage>
      </>
    );
  };

  const content = (
    <div
      data-test-datepicker-container
      className={css.container}
      ref={container}
      onFocus={handleInternalFocus}
      onBlur={onBlur}
    >
      <TextField
        {...props}
        id={testId}
        readOnly={readOnly}
        disabled={disabled}
        value={valueProp}
        onChange={onChange}
        endControl={renderEndElement()}
        hasClearIcon={false}
        inputRef={inputRef}
      />
    </div>
  );

  const portalElem = usePortal ? document.getElementById('OverlayContainer') : null;

  return (
    <div
      data-testid="date-picker"
      className={css.container}
      {...pickDataProps(props)}
    >
      {content}
      <Popper
        placement={placement}
        isOpen={showCalendar}
        anchorRef={container}
        onToggle={toggleCalendar}
        portal={usePortal && portalElem}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0,10',
          },
          ...modifiers,
        }}
      >
        {renderCalendar()}
      </Popper>
    </div>
  );
};

TextDateField.propTypes = propTypes;
TextDateField.defaultProps = defaultProps;

export const TextDate = injectIntl(TextDateField);
