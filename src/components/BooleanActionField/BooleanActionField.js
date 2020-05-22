import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import { get } from 'lodash';

import { Select } from '@folio/stripes/components';

import {
  ENTITY_KEYS,
  FORMS_SETTINGS,
} from '../../utils';

export const BooleanActionFieldComponent = ({
  id,
  name,
  label,
  placeholder,
  intl,
  disabled,
}) => {
  const actions = get(FORMS_SETTINGS, [ENTITY_KEYS.MAPPING_PROFILES, 'DECORATORS', 'BOOLEAN_ACTIONS'], []);
  const dataOptions = actions.map(action => ({
    value: action.value,
    label: intl.formatMessage({ id: action.label }),
  }));

  const checkboxPlaceholder = intl.formatMessage({ id: 'ui-data-import.settings.mappingProfiles.map.administrativeData.field.selectCheckboxFieldMapping' });

  return (
    <Field
      id={id}
      component={Select}
      name={name}
      label={label}
      placeholder={placeholder || checkboxPlaceholder}
      dataOptions={dataOptions}
      disabled={disabled}
    />
  );
};

BooleanActionFieldComponent.propTypes = {
  name: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  id: PropTypes.string,
  label: PropTypes.oneOfType(PropTypes.node, PropTypes.string),
  placeholder: PropTypes.oneOfType(PropTypes.node, PropTypes.string),
  disabled: PropTypes.bool,
};

BooleanActionFieldComponent.defaultProps = {
  id: '',
  label: '',
  placeholder: '',
  disabled: false,
};

export const BooleanActionField = injectIntl(BooleanActionFieldComponent);
