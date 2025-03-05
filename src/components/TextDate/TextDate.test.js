import React, { createRef } from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { TextDate } from './TextDate';

const defaultTextDateProps = {
  id: 'testId',
  usePortal: true,
  readOnly: false,
  value: '',
};
const onChange = jest.fn();
const textDateProps = ({
  id,
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
  inputRef: createRef(),
  meta: { dirty: false },
  onFocus: noop,
  onSetDate: noop,
  placement: 'top',
  readOnly,
  required: false,
  showCalendar: false,
  value,
  'aria-label': 'test label',
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
  usePortal,
  value,
  ...rest
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
      usePortal={usePortal}
      value={value}
      {...rest}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('TextDate component', () => {
  afterEach(() => {
    onChange.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderTextDate(textDateProps(defaultTextDateProps));

    await runAxeTest({ rootNode: container });
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

      fireEvent.click(getByText('20'));

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
      fireEvent.click(getByText('20'));
      const clearIcon = container.querySelector('#datepicker-clear-button-testId');

      expect(clearIcon).toBeDefined();
    });

    describe('when clicking on clean value icon', () => {
      it('text date value should be empty', () => {
        const { container } = renderTextDate(textDateProps({
          id: 'testId',
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
      const {
        container,
        getByTestId,
      } = renderTextDate(textDateProps(defaultTextDateProps));
      const calendarIcon = container.querySelector('#datepicker-toggle-calendar-button-testId');

      fireEvent.click(calendarIcon);

      const calendarContainer = container.querySelector('.calendar');
      fireEvent.click(calendarContainer);

      fireEvent.click(getByTestId('date-picker'));

      expect(calendarContainer).not.toBeVisible();
    });
  });

  describe('when date in read only', () => {
    it('calendar icon and clean icon should not exist', () => {
      const { container } = renderTextDate(textDateProps({
        id: null,
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
