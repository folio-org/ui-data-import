import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  touch,
  change,
  untouch,
} from 'redux-form';
import { identity } from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Checkbox,
  MultiSelection,
  OptionSegment,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { FullScreenForm } from '../../components/FullScreenForm';
import {
  validateDataTypes,
  validateFileExtension,
  validateRequiredField,
} from '../../utils';
import { DATA_TYPES } from '../../utils/constants';

import css from './FileExtensionForm.css';

const formName = 'fileExtensionForm';

const MultiSelectItem = ({
  option,
  searchTerm,
}) => <OptionSegment searchTerm={searchTerm}>{option}</OptionSegment>;

MultiSelectItem.propTypes = {
  option: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  searchTerm: PropTypes.string,
};

const FileExtensionFormComponent = ({
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  onCancel,
  dispatch,
}) => {
  const isEditMode = Boolean(initialValues.id);

  const [dataTypesRequired, setDataTypesRequired] = useState(isEditMode ? !initialValues.importBlocked : true);

  const handleImportBlockedChange = (meta, value) => {
    if (value) {
      dispatch(change(formName, 'dataTypes', []));
      dispatch(untouch(formName, 'dataTypes'));
    }

    setDataTypesRequired(!value);
  };

  const handleMultiSelectBlur = e => {
    e.preventDefault();

    dispatch(touch(formName, 'dataTypes'));
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

  return (
    <FullScreenForm
      id="file-extensions-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsFileExtension" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={handleSubmit}
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
        />
      </div>
      <div data-test-extension-field>
        <Field
          label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
          name="extension"
          required
          component={TextField}
          validate={[
            validateRequiredField,
            validateFileExtension,
          ]}
        />
      </div>
      <div data-test-blocked-field>
        <p className={css.checkBoxLabel}>
          <FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />
        </p>
        <Field
          label={<FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />}
          name="importBlocked"
          type="checkbox"
          component={Checkbox}
          onChange={handleImportBlockedChange}
        />
      </div>
      <div data-test-types-field>
        <Field
          label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />}
          name="dataTypes"
          component={MultiSelection}
          dataOptions={DATA_TYPES}
          required={dataTypesRequired}
          disabled={!dataTypesRequired}
          validationEnabled
          itemToString={identity}
          validate={[validateDataTypes]}
          filter={filterMultiSelect}
          formatter={MultiSelectItem}
          onBlur={handleMultiSelectBlur}
        />
      </div>
    </FullScreenForm>
  );
};

FileExtensionFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const FileExtensionForm = stripesForm({
  form: formName,
  navigationCheck: true,
  enableReinitialize: true,
})(FileExtensionFormComponent);
