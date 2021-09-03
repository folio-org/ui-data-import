import React from 'react';
import { fireEvent } from '@testing-library/react';
import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { TextDate } from './TextDate';

const defaultTextDateProps = {
  id: 'testId',
  usePortal: false,
  readOnly: false,
  value: '',
};
const onChange = jest.fn();
const textDateProps = ({
  id,
  usePortal,
  readOnly,
  value,
}) => ({
  autoFocus: false,
  dateFormat: 'MM DD YYYY',
  disabled: false,
  hideOnChoose: true,
  id,
  input: {
    value: 'test value',
    onChange: noop,
  },
  inputRef: {},
  meta: { dirty: false },
  onFocus: noop,
  onSetDate: noop,
  placement: 'top',
  readOnly,
  required: false,
  showCalendar: false,
  useInput: false,
  usePortal,
  value,
});

const renderTextDate = ({
  autoFocus,
  dateFormat,
  disabled,
  hideOnChoose,
  id,
  input,
  inputRef,
  meta,
  onFocus,
  onSetDate,
  placement,
  readOnly,
  required,
  showCalendar,
  useInput,
  usePortal,
  value,
}) => {
  const component = (
    <TextDate
      autoFocus={autoFocus}
      dateFormat={dateFormat}
      disabled={disabled}
      hideOnChoose={hideOnChoose}
      id={id}
      input={input}
      inputRef={inputRef}
      meta={meta}
      onChange={onChange}
      onFocus={onFocus}
      onSetDate={onSetDate}
      placement={placement}
      readOnly={readOnly}
      required={required}
      showCalendar={showCalendar}
      useInput={useInput}
      usePortal={usePortal}
      value={value}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('TextDate', () => {
  afterEach(() => {
    onChange.mockClear();
  });

  describe('when clicking on calendar icon', () => {
    it('calendar should be rendered', () => {
      const { container } = renderTextDate(textDateProps(defaultTextDateProps));
      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');

      fireEvent.click(calendarIcon);

      const calendarContainer = container.querySelector('.calendar');

      expect(calendarContainer).toBeVisible();
    });
  });

  describe('when pressing Escape button', () => {
    it('calendar should be closed', () => {
      const { container } = renderTextDate(textDateProps(defaultTextDateProps));
      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');

      fireEvent.click(calendarIcon);

      const calendarContainer = container.querySelector('.calendar');

      fireEvent.keyDown(calendarContainer, {
        key: 'Escape',
        code: 'Escape',
      });

      expect(calendarContainer).not.toBeVisible();
    });
  });

  describe('when choosing a new date using calendar', () => {
    it('calendar should be closed', () => {
      const {
        container,
        getByText,
      } = renderTextDate(textDateProps(defaultTextDateProps));

      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');

      fireEvent.click(calendarIcon);

      const calendarContainer = container.querySelector('.calendar');

      fireEvent.click(getByText('23'));

      expect(calendarContainer).not.toBeVisible();
    });
  });

  describe('when date input has value', () => {
    it('should appear clean value icon', () => {
      const {
        container,
        getByText,
      } = renderTextDate(textDateProps(defaultTextDateProps));
      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');

      fireEvent.click(calendarIcon);

      fireEvent.click(getByText('23'));
      const clearIcon = container.querySelector('#datepicker-clear-button-testId');

      expect(clearIcon).toBeDefined();
    });

    describe('when clicking on clean value icon', () => {
      it('text date value should be empty', () => {
        const { container } = renderTextDate(textDateProps({
          id: 'testId',
          usePortal: true,
          readOnly: false,
          value: '03 03 2021',
        }));
        const clearIcon = container.querySelector('#datepicker-clear-button-testId');

        fireEvent.click(clearIcon);

        expect(onChange.mock.calls[0][0]).toEqual('');
      });
    });
  });

  describe('when double ckicking on calendar icon', () => {
    it('calendar should be closed', () => {
      const { container } = renderTextDate(textDateProps(defaultTextDateProps));
      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');

      fireEvent.click(calendarIcon);

      const calendarContainer = container.querySelector('.calendar');

      fireEvent.click(calendarContainer);

      fireEvent.click(calendarIcon);

      expect(calendarContainer).not.toBeVisible();
    });
  });

  describe('when date in read only', () => {
    it('calendar icon and clean icon should not exist', () => {
      const { container } = renderTextDate(textDateProps({
        id: null,
        usePortal: true,
        readOnly: true,
        value: '',
      }));
      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');
      const clearIcon = container.querySelector('#datepicker-clear-button-testId');

      expect(calendarIcon).toBeNull();
      expect(clearIcon).toBeNull();
    });
  });
});
