import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { DatePickerDecorator } from './DatePickerDecorator';

const onChange = jest.fn();

const renderDatePickerDecorator = () => {
  const wrappedComponent = () => <input />;
  const component = (
    <DatePickerDecorator
      wrappedComponent={wrappedComponent}
      wrapperLabel="datePickerLabel"
      input={{
        value: '',
        onChange,
      }}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Date picker decorator component', () => {
  afterEach(() => {
    onChange.mockClear();
  });

  describe('rendering Date picker decorator', () => {
    it('should be visible', () => {
      const { getByTestId } = renderDatePickerDecorator();

      expect(getByTestId('date-picker-decorator')).toBeDefined();
    });

    it('should display correct label for the dropdown', () => {
      const { getByLabelText } = renderDatePickerDecorator();

      expect(getByLabelText('datePickerLabel')).toBeDefined();
    });

    it('should have options "Today" and "Choose date"', () => {
      const {
        getByLabelText,
        getByText,
      } = renderDatePickerDecorator();

      fireEvent.click(getByLabelText('datePickerLabel'));

      expect(getByText('Today')).toBeDefined();
      expect(getByText('Choose date')).toBeDefined();
    });

    describe('when "Today" option selected', () => {
      it('then ###TODAY### value should be added to input', () => {
        const {
          getByLabelText,
          getByText,
        } = renderDatePickerDecorator();

        fireEvent.click(getByLabelText('datePickerLabel'));
        fireEvent.click(getByText('Today'));

        expect(onChange).toHaveBeenCalledWith('###TODAY###');
      });
    });

    describe('when "Choose date" option selected', () => {
      it('then date picker should be rendered', () => {
        const {
          getByLabelText,
          getByText,
          getByTestId,
        } = renderDatePickerDecorator();

        fireEvent.click(getByLabelText('datePickerLabel'));
        fireEvent.click(getByText('Choose date'));

        expect(getByTestId('date-picker')).toBeDefined();
      });
    });
  });
});
