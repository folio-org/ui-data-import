import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { BooleanActionField } from './BooleanActionField';

const onBooleanFieldChangeMock = jest.fn();

const renderBooleanActionField = ({ placeholder }) => {
  const component = () => (
    <BooleanActionField
      label="testLabel"
      name="testField"
      placeholder={placeholder}
      onBooleanFieldChange={onBooleanFieldChangeMock}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Boolean action field component', () => {
  afterEach(() => {
    onBooleanFieldChangeMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderBooleanActionField({});

    await runAxeTest({ rootNode: container });
  });

  describe('when a form has wrapped component', () => {
    it('then the wrapped component should be rendered', () => {
      expect(renderBooleanActionField({})).toBeDefined();
    });

    it('then the wrapped component should render label', () => {
      const { getByLabelText } = renderBooleanActionField({});

      expect(getByLabelText('testLabel')).toBeDefined();
    });
  });

  describe('when "placeholder" prop is not passed', () => {
    it('then component should render default placeholder', () => {
      const { getByText } = renderBooleanActionField({});

      expect(getByText('Select сheckbox field mapping')).toBeDefined();
    });
  });

  describe('when "placeholder" prop is passed', () => {
    it('then component should render the passed placeholder', () => {
      const { getByText } = renderBooleanActionField({ placeholder: 'testPlaceholder' });

      expect(getByText('testPlaceholder')).toBeDefined();
    });
  });

  describe('when select default value', () => {
    it('function for changing value should be called', () => {
      const { container } = renderBooleanActionField({ placeholder: 'testPlaceholder' });
      const selectElement = container.querySelector('[name="testField"]');

      fireEvent.change(selectElement, { target: { value: 'testPlaceholder' } });

      expect(onBooleanFieldChangeMock).toHaveBeenCalled();
    });
  });
});
