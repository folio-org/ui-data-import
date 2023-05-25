import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { FolioRecordTypeSelect } from './FolioRecordTypeSelect';

const renderFolioRecordTypeSelect = ({
  formType,
  onRecordSelect,
}) => {
  const dataOptions = [{
    label: 'option_1',
    value: 'value_1',
  }, {
    label: 'option_2',
    value: 'value_2',
  }];

  const component = () => (
    <FolioRecordTypeSelect
      fieldName="folioRecord"
      dataOptions={dataOptions}
      onRecordSelect={onRecordSelect}
      formType={formType}
    />
  );

  const componentWithForm = formType === 'redux-form' ? renderWithReduxForm(component) : renderWithFinalForm(component);

  return renderWithIntl(componentWithForm, translationsProperties);
};

describe('FolioRecordTypeSelect component', () => {
  describe('inside the redux-form', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFolioRecordTypeSelect({ formType: 'redux-form' });

      await runAxeTest({ rootNode: container });
    });

    it('should be rendered', () => {
      const { getByText } = renderFolioRecordTypeSelect({ formType: 'redux-form' });

      expect(getByText('FOLIO record type')).toBeDefined();
    });
  });

  describe('inside the final-form', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderFolioRecordTypeSelect({ formType: 'final-form' });

      await runAxeTest({ rootNode: container });
    });

    it('should be rendered', () => {
      const { getByText } = renderFolioRecordTypeSelect({ formType: 'final-form' });

      expect(getByText('FOLIO record type')).toBeDefined();
    });
  });

  describe('when "onRecordSelect" prop is passed', () => {
    it('should be called on field change', () => {
      const onRecordSelect = jest.fn();
      const { getByTestId } = renderFolioRecordTypeSelect({
        formType: 'final-form',
        onRecordSelect,
      });

      const selectElement = getByTestId('folio-record-type-select');

      fireEvent.change(selectElement, { target: { value: 'option_1' } });

      expect(onRecordSelect.mock.calls.length).toEqual(1);
    });
  });
});
