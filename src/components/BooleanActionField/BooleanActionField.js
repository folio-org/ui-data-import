import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';
import { get } from 'lodash';

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
  disabled,
}) => {
  const intl = useIntl();

  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'BOOLEAN_ACTIONS'], []);
  const dataOptions = actions.map(action => ({
    value: action.value,
    label: intl.formatMessage({ id: action.label }),
  }));

  const defaultPlaceholderId = 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.selectCheckboxFieldMapping';
  const checkboxPlaceholder = placeholder || intl.formatMessage({ id: defaultPlaceholderId });

  return (
    <Field
      id={id}
      component={Select}
      name={name}
      label={label}
      placeholder={checkboxPlaceholder}
      dataOptions={dataOptions}
      disabled={disabled}
    />
  );
};

BooleanActionField.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.oneOfType(PropTypes.node, PropTypes.string),
  placeholder: PropTypes.oneOfType(PropTypes.node, PropTypes.string),
  disabled: PropTypes.bool,
};

BooleanActionField.defaultProps = {
  id: '',
  label: '',
  placeholder: '',
  disabled: false,
};
