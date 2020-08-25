import React, { createRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import contains from 'dom-helpers/query/contains';
import {
  debounce,
  uniqueId,
} from 'lodash';

import {
  Popper,
  IconButton,
  RootCloseWrapper,
  TextField,
} from '@folio/stripes/components';
import { AVAILABLE_PLACEMENTS } from '@folio/stripes-components/lib/Popper';
import Calendar from '@folio/stripes-components/lib/Datepicker/Calendar';
import css from '@folio/stripes-components/lib/Datepicker/Calendar.css';

const defaultParser = (value, timeZone, dateFormat) => {
  if (!value || value === '') { return value; }

  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  let inputMoment;

  // if date string contains a utc offset, we can parse it as utc time and convert it to selected timezone.
  if (offsetRegex.test(value)) {
    inputMoment = moment.tz(value, timeZone);
  } else {
    inputMoment = moment.tz(value, dateFormat, timeZone);
  }

  return inputMoment.format(dateFormat);
};

const propTypes = {
  autoFocus: PropTypes.bool,
  backendDateStandard: PropTypes.string,
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
  onBlur: PropTypes.func,
  onSetDate: PropTypes.func,
  parser: PropTypes.func,
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  showCalendar: PropTypes.bool,
  timeZone: PropTypes.string,
  useFocus: PropTypes.bool,
  value: PropTypes.string,
};

const defaultProps = {
  autoFocus: false,
  backendDateStandard: 'ISO8601',
  hideOnChoose: true,
  modifiers: {},
  parser: defaultParser,
  placement: 'bottom',
  screenReaderMessage: '',
  useFocus: true,
};

/**
 * This component is similar to the stripes <Datepicker> except that it allows to enter any text
 * to the input field.
 */
export class TextDate extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.picker = null;
    this.containerRef = createRef(null);
    this.textfield = props.inputRef || createRef(null);
    this.hiddenInput = createRef();

    this.dbhideCalendar = debounce(this.hideCalendar, 10);

    const timeZone = props.timeZone || props.intl.timeZone;
    const locale = props.locale || props.intl.locale;

    moment.locale(locale);

    const dateFormat = props.dateFormat || moment.localeData()._longDateFormat.L;

    this.state = {
      dateString: '',
      showCalendar: this.props.showCalendar || false,
      srMessage: '',
      dateFormat,
      timeZone,
      prevValue: '',
      locale,
    };

    if (props.id) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId('dp-');
    }
  }

  handleFieldFocus = () => {
    if (this.props.useFocus && !this.props.disabled) {
      this.showCalendar();
    }
  };

  handleFieldClick = () => {
    if (this.props.useFocus) {
      if (!this.state.showCalendar) {
        this.showCalendar();
      }
    }
  };

  handleRootClose = e => {
    // used by <RootCloseWrapper> to determine whether or not it should hide the picker.
    // it should determine that the element that's focused is outside of the datepicker's containing div and
    // the calendar widget (this.picker).
    if (!contains(this.containerRef.current, e.target)) {
      if (!this.datePickerIsFocused()) {
        this.hideCalendar();
      }
    }
  };

  showCalendar = () => {
    this.setState({ showCalendar: true });
  };

  hideCalendar = () => {
    this.setState({ showCalendar: false });
  };

  toggleCalendar = () => {
    this.setState(current => ({ showCalendar: !current.showCalendar }));
  };

  handleKeyDown = e => {
    if (this.picker) {
      const curDate = this.picker.getCursorDate();
      const formattedDate = curDate.format(this.state.dateFormat);
      let dateString;

      switch (e.keyCode) {
        case 40: // down
          e.preventDefault();
          dateString = this.picker.nextWeek();
          break;
        case 38: // up
          e.preventDefault();
          dateString = this.picker.previousWeek();
          break;
        case 37: // left
          dateString = this.picker.previousDay();
          break;
        case 39: // right
          dateString = this.picker.nextDay();
          break;
        case 27: // escape
          e.preventDefault();
          this.hideCalendar();
          break;
        case 34: // pgDn
          e.preventDefault();
          if (!this.state.showCalendar) { return; }
          if (!e.altKey) {
            dateString = this.picker.nextMonth();
          } else {
            dateString = this.picker.nextYear();
          }
          break;
        case 33: // pgUp
          e.preventDefault();
          if (!this.state.showCalendar) { return; }
          if (!e.altKey) {
            dateString = this.picker.previousMonth();
          } else {
            dateString = this.picker.previousYear();
          }
          break;
        case 13: // enter
          e.preventDefault();
          if (this.state.showCalendar) {
            const { onSetDate } = this.props;

            this.handleSetDate(e, curDate, formattedDate);
            if (onSetDate) {
              onSetDate(e, curDate, formattedDate, value => {
                this.internalSetState(
                  {
                    dateString: value,
                    prevValue: value,
                  },
                  'calendar',
                );
              });
            }
          } else {
            this.showCalendar();
          }
          dateString = (
            <FormattedMessage
              id="stripes-components.dateSelected"
              values={{ date: formattedDate }}
            />
          );
          break;
        case 9: // tab
          this.hideCalendar();
          break;
        default:
      }
      this.informScreenReader(`${dateString}`);
    } else {
      switch (e.keyCode) {
        case 13: // enter
        case 40: // down
          e.preventDefault();
          this.showCalendar();
          break;
        default:
      }
    }
  };

  internalSetState = (state, changeType, callbacks) => {
    this.setState(curState => {
      return {
        ...curState,
        ...state,
        changeType,
      };
    },
    () => {
      if (callbacks) {
        callbacks.forEach(cb => {
          cb(this.state);
        });
      }
    });
  };

  clearDate = () => {
    this.internalSetState(
      {
        dateString: '',
        hiddenValue: '',
      },
      'clear',
    );

    this.props.onChange('');
  };

  cleanForScreenReader(str) {
    return str.replace(/Y/g, 'Y ');
  }

  informScreenReader(str) {
    this.setState({ srMessage: str });
  }

  datePickerIsFocused() {
    if (contains(this.containerRef.current, document.activeElement) &&
      document.activeElement !== document.body) {
      if (this.picker) {
        return (contains(this.picker.getDOMContainer(), document.activeElement));
      }

      return true;
    }

    return false;
  }

  hideOnBlur = e => {
    const { onBlur } = this.props;

    if (this.datePickerIsFocused()) {
      if (onBlur) {
        onBlur(e);
      }
      this.hideCalendar();
      this.setState({ srMessage: '' });
    }
  };

  standardizeDate(date) {
    const DATE_RFC2822 = 'ddd, MM MMM YYYY HH:mm:ss ZZ';
    const { backendDateStandard } = this.props;
    const parsed = moment.tz(date, this.state.dateFormat, this.state.timeZone);

    if (/8601/.test(backendDateStandard)) {
      return parsed.toISOString();
    }

    if (/2822/.test(backendDateStandard)) {
      return parsed.format(DATE_RFC2822);
    }

    return parsed.format(this.props.backendDateStandard);
  }

  handleSetDate = (e, date, stringDate) => {
    const { onSetDate } = this.props;
    const isValidDate = moment(stringDate, this.state.dateFormat, true).isValid();
    let standardizedDate;

    e.preventDefault();
    this.textfield.current.focus();

    if (isValidDate) {
      // convert date to ISO 8601 format for backend
      standardizedDate = this.standardizeDate(stringDate);

      // handlers take the value rather than the event...
      this.internalSetState(
        {
          dateString: stringDate,
          hiddenValue: standardizedDate,
          prevValue: stringDate,
        },
        'calendar',
        [this.dbhideCalendar],
      );
    }

    if (onSetDate) {
      onSetDate(e, stringDate);
    }
  };

  renderCalendar() {
    const { exclude } = this.props;

    return (
      <RootCloseWrapper onRootClose={this.handleRootClose}>
        <Calendar
          onSetDate={this.handleSetDate}
          selectedDate={this.state.dateString}
          dateFormat={this.state.dateFormat}
          ref={ref => { this.picker = ref; }}
          onKeyDown={this.handleKeyDown}
          onBlur={this.hideCalendar}
          locale={this.state.locale}
          exclude={exclude}
          id={this.testId}
        />
      </RootCloseWrapper>
    );
  }

  renderEndElement() {
    return (
      <>
        { this.props.value !== '' && (
          <FormattedMessage id="stripes-components.clearFieldValue">
            {ariaLabel => (
              <IconButton
                data-test-clear
                key="clearButton"
                onClick={this.clearDate}
                aria-label={ariaLabel}
                id={`datepicker-clear-button-${this.testId}`}
                tabIndex="-1"
                icon="times-circle-solid"
              />
            )}
          </FormattedMessage>
        )}
        <FormattedMessage id="stripes-components.showOrHideDatepicker">
          {ariaLabel => (
            <IconButton
              data-test-calendar-button
              onKeyDown={this.handleKeyDown}
              onClick={this.toggleCalendar}
              onFocus={e => { e.stopPropagation(); }}
              aria-label={ariaLabel}
              id={`datepicker-toggle-calendar-button-${this.testId}`}
              tabIndex="-1"
              icon="calendar"
            />
          )}
        </FormattedMessage>
      </>
    );
  }

  renderInput() {
    const {
      screenReaderMessage,
      label,
      readOnly,
      required,
      disabled,
      autoFocus,
    } = this.props;

    const screenReaderFormat = this.cleanForScreenReader(this.state.dateFormat);

    let ariaLabel;

    if (readOnly || disabled) {
      ariaLabel = `${label}`;
    } else {
      ariaLabel = (
        <FormattedMessage
          id="stripes-components.screenReaderLabel"
          values={{
            label,
            screenReaderFormat,
            screenReaderMessage,
          }}
        />
      );
    }

    let textFieldProps = {
      label,
      readOnly,
      disabled,
      required,
      autoFocus,
      id: this.testId,
      inputRef: this.textfield,
      onChange: this.props.onChange,
      'aria-label': ariaLabel,
      onBlur: this.hideOnBlur,
      hasClearIcon: false,
      autoComplete: 'off',
    };

    if (!readOnly && !disabled) {
      textFieldProps = {
        ...textFieldProps,
        endControl: this.renderEndElement(),
        onKeyDown: this.handleKeyDown,
        onClick: this.handleFieldClick,
        onFocus: this.handleFieldFocus,
      };
    }

    if (this.props.meta) {
      textFieldProps = {
        ...textFieldProps,
        meta: this.props.meta,
        input: { value: this.props.value },
      };
    }

    return <TextField {...textFieldProps} />;
  }

  render() {
    const {
      placement,
      modifiers,
    } = this.props;

    const content = (
      <div
        className={css.container}
        ref={this.containerRef}
      >
        <div
          aria-live="assertive"
          aria-relevant="additions"
          className="sr-only"
        >
          <div>{this.state.srMessage}</div>
        </div>
        {this.renderInput()}
        <input
          type="hidden"
          hidden
          value={this.state.hiddenValue}
          ref={this.hiddenInput}
        />
      </div>
    );

    return (
      <>
        {content}
        <Popper
          placement={placement}
          isOpen={this.state.showCalendar}
          anchorRef={this.containerRef}
          onToggle={this.toggleCalendar}
          modifiers={{
            offset: {
              enabled: true,
              offset: '0,10',
            },
            ...modifiers,
          }}
        >
          {this.renderCalendar()}
        </Popper>
      </>
    );
  }
}
