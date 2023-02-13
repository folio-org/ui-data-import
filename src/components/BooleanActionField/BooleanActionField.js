import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes/components';

import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
} from '../../utils';

export const BooleanActionField = ({
  id,
  name,
  label,
  placeholder,
  onBooleanFieldChange,
  required,
  disabled,
}) => {
  const intl = useIntl();

  const actions = FORMS_SETTINGS[ENTITY_KEYS.MAPPING_PROFILES].DECORATORS.BOOLEAN_ACTIONS;
  const dataOptions = actions.map(action => ({
    value: action.value,
    label: intl.formatMessage({ id: action.label }),
  }));

  const defaultPlaceholderId = 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.selectCheckboxFieldMapping';
  const checkboxPlaceholder = placeholder || intl.formatMessage({ id: defaultPlaceholderId });
  const defaultDataOption = { label: checkboxPlaceholder, value: '' };

  const handleBooleanActionChange = e => {
    e.preventDefault();
    e.target.blur();

    if (!e.target.value) {
      onBooleanFieldChange(name, null);
    }
  };

  return (
    <Field
      id={id}
      component={Select}
      name={name}
      label={label}
      dataOptions={[defaultDataOption, ...dataOptions]}
      onChange={handleBooleanActionChange}
      required={required}
      disabled={disabled}
    />
  );
};

BooleanActionField.propTypes = {
  name: PropTypes.string.isRequired,
  onBooleanFieldChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  placeholder: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

BooleanActionField.defaultProps = {
  id: '',
  label: '',
  placeholder: '',
  required: false,
  disabled: false,
};
