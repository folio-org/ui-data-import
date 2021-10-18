import React, {
  useState,
  useMemo,
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
  setReferenceTables,
  disabled,
  label,
  name,
  required,
  id,
  mutator,
  validate,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  const selectOrganization = useCallback(organization => {
    if (onSelect) onSelect(organization);

    setSelectedOrganization(organization);

    setReferenceTables(name, `"${organization.id}"`);
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (id) {
      if (selectedOrganization.id !== id) {
        mutator.fieldOrganizationOrg.GET()
          .then(setSelectedOrganization);
      }
    } else {
      setSelectedOrganization({});
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearOrganization = useCallback(() => {
    setSelectedOrganization({});

    setReferenceTables(name, '');
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearButton = useMemo(() => {
    if (selectedOrganization.id && !disabled) {
      return (
        <IconButton
          onClick={clearOrganization}
          icon="times-circle-solid"
          size="small"
        />
      );
    }

    return null;
  }, [selectedOrganization, disabled]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Field
        id={name}
        component={TextField}
        disabled
        endControl={clearButton}
        fullWidth
        hasClearIcon={false}
        label={label}
        name={name}
        required={required}
        validate={validate}
        format={() => selectedOrganization.name}
      />

      {!disabled && (
        <div>
          <Pluggable
            id={`${name}-plugin`}
            aria-haspopup="true"
            dataKey="organization"
            searchButtonStyle="link"
            searchLabel={<FormattedMessage id="stripes-acq-components.filter.organization.lookup" />}
            selectVendor={selectOrganization}
            type="find-organization"
          >
            <FormattedMessage id="stripes-acq-components.filter.organization.lookupNoSupport" />
          </Pluggable>
        </div>
      )}
    </div>
  );
};

FieldOrganization.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  name: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.func,
};

FieldOrganization.defaultProps = {
  disabled: false,
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
