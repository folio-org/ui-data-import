import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import faker from 'faker';
import { fireEvent } from '@testing-library/react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { FileExtensionFormComponent } from './FileExtensionForm';

import { BASE_URLS } from '../../utils';

const initialValuesNewForm = {
  dataTypes: [],
  description: '',
  extension: '',
  importBlocked: false,
};
const initialValuesEditForm = {
  ...initialValuesNewForm,
  id: faker.random.uuid(),
  extension: '.dat',
};

const handleFormSubmit = jest.fn(() => Promise.resolve({}));

const fileExtensionFormProps = {
  pristine: false,
  submitting: false,
  form: {
    getState: () => ({ values: { importBlocked: false } }),
    change: noop,
    reset: noop,
  },
  match: { path: '/settings/data-import/file-extensions' },
  transitionToParams: noop,
  handleSubmit: handleFormSubmit,
  onSubmitSuccess: jest.fn(),
};

const renderFileExtensionForm = ({
  pristine,
  submitting,
  form,
  initialValues,
  handleSubmit,
  onSubmitSuccess,
  transitionToParams,
  match,
}) => {
  const component = () => (
    <Router>
      <FileExtensionFormComponent
        baseUrl={BASE_URLS.FILE_EXTENSIONS}
        pristine={pristine}
        submitting={submitting}
        form={form}
        match={match}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        onSubmitSuccess={onSubmitSuccess}
        onCancel={noop}
        transitionToParams={transitionToParams}
        baseUrl="base-url"
      />
    </Router>
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('FileExtensionForm component', () => {
  afterAll(() => {
    handleFormSubmit.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderFileExtensionForm({
      ...fileExtensionFormProps,
      initialValues: initialValuesNewForm,
    });

    await runAxeTest({ rootNode: container });
  });

  describe('when form is in creating new record mode', () => {
    it('should be rendered', () => {
      const { getAllByText } = renderFileExtensionForm({
        ...fileExtensionFormProps,
        initialValues: initialValuesNewForm,
      });

      expect(getAllByText('New file extension mapping')).toBeDefined();
    });
  });

  describe('when form is in edit mode', () => {
    it('extension should be rendered in pane title', () => {
      const { getByText } = renderFileExtensionForm({
        ...fileExtensionFormProps,
        initialValues: initialValuesEditForm,
      });

      expect(getByText('Edit .dat')).toBeDefined();
    });
  });

  describe('when changing Block import value', () => {
    it('should disable Data types field', () => {
      const {
        getByRole,
        container,
      } = renderFileExtensionForm({
        ...fileExtensionFormProps,
        initialValues: initialValuesNewForm,
      });

      const blockImportCheckbox = getByRole('checkbox', { name: 'Block import' });
      const dataTypesInput = container.querySelector(('.multiSelectFilterField'));

      fireEvent.click(blockImportCheckbox);

      expect(dataTypesInput).toHaveAttribute('disabled');
    });
  });

  describe('when selecting data type', () => {
    it('should filter select options correctly', () => {
      const {
        getByRole,
        container,
      } = renderFileExtensionForm({
        ...fileExtensionFormProps,
        initialValues: initialValuesEditForm,
      });

      const dataTypesInput = container.querySelector(('.multiSelectFilterField'));

      fireEvent.change(dataTypesInput, { target: { value: 'ma' } });

      expect(getByRole('option').textContent).toEqual('MARC+');
    });

    it('should display selected value', () => {
      const {
        getByRole,
        container,
      } = renderFileExtensionForm({
        ...fileExtensionFormProps,
        initialValues: initialValuesEditForm,
      });

      const dataTypesField = container.querySelector(('.multiSelectFilterField'));
      const dataTypesInput = container.querySelector(('.multiSelectValueInput'));

      fireEvent.change(dataTypesField, { target: { value: 'ma' } });
      fireEvent.click(getByRole('option'));
      fireEvent.blur(dataTypesField);

      expect(dataTypesInput.value).toEqual('MARC');
    });
  });

  describe('when submitting the form', () => {
    it('should save the profile', () => {
      const {
        getByLabelText,
        getByRole,
        getByText,
      } = renderFileExtensionForm({
        ...fileExtensionFormProps,
        initialValues: initialValuesNewForm,
      });

      const fileExtensionField = getByLabelText('File extension', {
        exact: false,
        selector: 'input',
      });
      const blockImportCheckbox = getByRole('checkbox', { name: 'Block import' });

      fireEvent.change(fileExtensionField, { target: { value: '.txt' } });
      fireEvent.click(blockImportCheckbox);
      fireEvent.click(getByText('Save as file extension & Close'));

      expect(handleFormSubmit).toHaveBeenCalled();
    });
  });
});
