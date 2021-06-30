import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { BooleanActionField } from './BooleanActionField';

const renderBooleanActionField = ({ placeholder }) => {
  const component = () => (
    <BooleanActionField
      label="testLabel"
      name="testField"
      placeholder={placeholder}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('Boolean action field component', () => {
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
});
