import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';
import {
  TextField,
  IconButton,
} from '@folio/stripes/components';

const FieldOrganization = ({
  onSelect,
  onClear,
  setReferenceTables,
  isFieldDisabled,
  isLookupDisabled,
  label,
  name,
  required,
  id,
  mutator,
  validate,
  mappingValue,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(!!id);
  const [mappingQuery, setMappingQuery] = useState(mappingValue || '');

  const selectOrganization = organization => {
    onSelect?.(organization);
    setSelectedOrganization(organization);
    setReferenceTables(name, `${mappingQuery}"${organization.id}"`);
    setIsClearButtonVisible(true);
  };

  useEffect(() => {
    if (id) {
      if (selectedOrganization?.id !== id) {
        mutator.fieldOrganizationOrg.GET()
          .then(setSelectedOrganization);
      }
    } else {
      setSelectedOrganization(null);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearOrganization = useCallback(() => {
    setSelectedOrganization(null);
    setMappingQuery('');
    setReferenceTables(name, '');
    setIsClearButtonVisible(false);

    if (onClear) {
      onClear();
    }
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearButton = isClearButtonVisible
    ? (
      <IconButton
        onClick={clearOrganization}
        icon="times-circle-solid"
        size="small"
      />)
    : null;

  const handleFieldFormat = useCallback(value => {
    const mappingQueryFromValue = value?.substring(0, value.indexOf('"')) || '';

    return (selectedOrganization ? `${mappingQueryFromValue}"${selectedOrganization?.name}"` : value);
  }, [selectedOrganization]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFieldChange = e => {
    e.preventDefault();
    const organizationNameMatch = e.target.value.match(`"${selectedOrganization?.name}"`);
    const organizationNameWithQuotes = organizationNameMatch ? organizationNameMatch[0] : null;
    const organizationNameFromValue = organizationNameWithQuotes?.replace(/['"]+/g, '');

    if (organizationNameFromValue && organizationNameFromValue === selectedOrganization?.name) {
      const mappingQueryFromValue = e.target.value.substring(0, e.target.value.indexOf('"')) || '';
      setMappingQuery(mappingQueryFromValue);
      setReferenceTables(name, `${mappingQueryFromValue}"${selectedOrganization?.id}"`);
    } else {
      setMappingQuery(e.target.value);
      setReferenceTables(name, e.target.value);
    }
    setIsClearButtonVisible(!!e.target.value);
  };

  return (
    <div>
      <Field
        id={name}
        component={TextField}
        disabled={isFieldDisabled}
        endControl={clearButton}
        fullWidth
        hasClearIcon={false}
        label={label}
        name={name}
        required={required}
        validate={validate}
        format={handleFieldFormat}
        onChange={handleFieldChange}
        onBlur={e => e.preventDefault()}
      />
      <div>
        <Pluggable
          id={`${name}-plugin`}
          aria-haspopup="true"
          dataKey="organization"
          searchButtonStyle="link"
          searchLabel={<FormattedMessage id="stripes-acq-components.filter.organization.lookup" />}
          selectVendor={selectOrganization}
          type="find-organization"
          disabled={isLookupDisabled}
        >
          <FormattedMessage id="stripes-acq-components.filter.organization.lookupNoSupport" />
        </Pluggable>
      </div>
    </div>
  );
};

FieldOrganization.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onClear: PropTypes.func,
  isFieldDisabled: PropTypes.bool,
  isLookupDisabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  name: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.func,
  mappingValue: PropTypes.string,
};

FieldOrganization.defaultProps = {
  isFieldDisabled: false,
  isLookupDisabled: false,
  required: false,
};

FieldOrganization.manifest = {
  fieldOrganizationOrg: {
    type: 'okapi',
    path: 'organizations/organizations/!{id}',
    throwErrors: false,
    perRequest: 1000,
    accumulate: true,
    fetch: false,
  },
};

export default stripesConnect(FieldOrganization);
