import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { identity } from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Checkbox,
  MultiSelection,
  OptionSegment,
} from '@folio/stripes/components';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  validateDataTypes,
  validateFileExtension,
  validateRequiredField,
  composeValidators,
  DATA_TYPES,
  isFieldPristine,
  handleProfileSave,
} from '../../utils';
import { EditKeyShortcutsWrapper } from '../../components';

import css from './FileExtensionForm.css';

const MultiSelectItem = ({
  option,
  searchTerm,
}) => <OptionSegment searchTerm={searchTerm}>{option}</OptionSegment>;

MultiSelectItem.propTypes = {
  option: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  searchTerm: PropTypes.string,
};

export const FileExtensionFormComponent = ({
  pristine,
  submitting,
  form,
  initialValues,
  handleSubmit,
  onCancel,
  transitionToParams,
  baseUrl,
}) => {
  const isEditMode = Boolean(initialValues.id);

  const [dataTypesRequired, setDataTypesRequired] = useState(isEditMode ? !initialValues.importBlocked : true);

  const handleImportBlockedChange = (event, input) => {
    const value = event.target.value === 'true';

    input.onChange(event);
    form.change('dataTypes', []);

    setDataTypesRequired(value);
  };

  const filterMultiSelect = (filterText, list) => {
    const filterRegExp = new RegExp(`^${filterText}`, 'i');
    const renderedItems = filterText ? list.filter(item => item.search(filterRegExp) !== -1) : list;
    const exactMatch = filterText ? (renderedItems.filter(item => item === filterText).length === 1) : false;

    return {
      renderedItems,
      exactMatch,
    };
  };

  const isSubmitDisabled = pristine || submitting;

  const paneTitle = isEditMode
    ? (
      <FormattedMessage id="ui-data-import.edit">
        {txt => `${txt} ${initialValues.extension}`}
      </FormattedMessage>
    )
    : <FormattedMessage id="ui-data-import.settings.fileExtension.newMapping" />;
  const headLine = isEditMode
    ? initialValues.extension
    : <FormattedMessage id="ui-data-import.settings.fileExtension.newMapping" />;

  const onSubmit = async event => {
    await handleProfileSave(handleSubmit, form.reset, transitionToParams, baseUrl)(event);
  };

  return (
    <EditKeyShortcutsWrapper onSubmit={onSubmit}>
      <FullScreenForm
        id="file-extensions-form"
        paneTitle={paneTitle}
        submitButtonText={<FormattedMessage id="ui-data-import.saveAsFileExtension" />}
        cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
        isSubmitButtonDisabled={isSubmitDisabled}
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <Headline
          size="xx-large"
          tag="h2"
          data-test-header-title
        >
          {headLine}
        </Headline>
        <div data-test-description-field>
          <Field
            label={<FormattedMessage id="ui-data-import.description" />}
            name="description"
            component={TextArea}
            isEqual={isFieldPristine}
          />
        </div>
        <div data-test-extension-field>
          <Field
            label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
            name="extension"
            required
            component={TextField}
            validate={composeValidators(validateRequiredField, validateFileExtension)}
            isEqual={isFieldPristine}
          />
        </div>
        <div data-test-blocked-field>
          <p className={css.checkBoxLabel}>
            <FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />
          </p>
          <Field
            name="importBlocked"
            type="checkbox"
            render={importBlockedFieldProps => (
              <Checkbox
                {...importBlockedFieldProps}
                value={form.getState().values?.importBlocked}
                label={<FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />}
                onChange={event => handleImportBlockedChange(event, importBlockedFieldProps.input)}
              />
            )}
          />
        </div>
        <div data-test-types-field>
          <Field
            name="dataTypes"
            validate={validateDataTypes}
            validationEnabled
            isEqual={isFieldPristine}
            render={dataTypesFieldProps => (
              <MultiSelection
                {...dataTypesFieldProps}
                label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />}
                dataOptions={DATA_TYPES}
                required={dataTypesRequired}
                disabled={!dataTypesRequired}
                itemToString={identity}
                filter={filterMultiSelect}
                formatter={MultiSelectItem}
                onChange={selectedItems => dataTypesFieldProps.input.onChange(selectedItems)}
                onBlur={event => dataTypesFieldProps.input.onBlur(event)}
                dirty={dataTypesFieldProps.meta.dirty}
              />
            )}
          />
        </div>
      </FullScreenForm>
    </EditKeyShortcutsWrapper>
  );
};

FileExtensionFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }).isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  transitionToParams: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const FileExtensionForm = stripesFinalForm({ navigationCheck: true })(FileExtensionFormComponent);
