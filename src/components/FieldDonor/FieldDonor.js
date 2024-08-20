import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';
import { DonorsLookup } from '@folio/stripes-acq-components';

import {
  getMappingQueryFromValue,
  getMatchByUuidInQuotes,
} from '../../settings/MappingProfiles/detailsSections/utils';

export const FieldDonor = ({
  onSelect,
  onClear,
  setReferenceTables,
  label,
  name,
  inputValue,
  allDonors,
  validate,
  disabled = false,
  required = false,
}) => {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [mappingQuery, setMappingQuery] = useState('');

  useEffect(() => {
    const uuid = getMatchByUuidInQuotes(inputValue);

    if (uuid && allDonors?.length) {
      if (selectedDonor?.id !== uuid) {
        const donorFromResources = allDonors.find(donor => donor.id === uuid);

        setSelectedDonor(donorFromResources);
      }
    }
  }, [inputValue, allDonors, selectedDonor]);

  useEffect(() => {
    const mappingValue = getMappingQueryFromValue(inputValue);

    if (mappingValue) {
      setMappingQuery(mappingValue);
    }
  }, [inputValue]);

  const selectDonor = donor => {
    onSelect?.(donor);
    setSelectedDonor(donor);
    setReferenceTables(name, `${mappingQuery}"${donor.id}"`);
  };

  const clearDonor = useCallback(() => {
    setSelectedDonor(null);
    setMappingQuery('');
    setReferenceTables(name, '');

    if (onClear) {
      onClear();
    }
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFieldFormat = useCallback(value => {
    const mappingQueryFromValue = value?.substring(0, value.indexOf('"')) || '';

    return (selectedDonor ? `${mappingQueryFromValue}"${selectedDonor?.name}"` : value);
  }, [selectedDonor]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFieldChange = e => {
    e.preventDefault();
    const donorNameMatch = e.target.value.match(`"${selectedDonor?.name}"`);
    const donorNameWithQuotes = donorNameMatch ? donorNameMatch[0] : null;
    const donorNameFromValue = donorNameWithQuotes?.replace(/['"]+/g, '');

    if (donorNameFromValue && donorNameFromValue === selectedDonor?.name) {
      const mappingQueryFromValue = e.target.value.substring(0, e.target.value.indexOf('"')) || '';
      setMappingQuery(mappingQueryFromValue);
      setReferenceTables(name, `${mappingQueryFromValue}"${selectedDonor?.id}"`);
    } else {
      setMappingQuery(e.target.value);
      setReferenceTables(name, e.target.value);
    }
  };

  return (
    <div>
      <Field
        id={name}
        component={TextField}
        disabled={disabled}
        fullWidth
        label={label}
        name={name}
        required={required}
        validate={validate}
        format={handleFieldFormat}
        onChange={handleFieldChange}
        onClearField={clearDonor}
      />
      <div>
        <DonorsLookup
          name={name}
          searchButtonStyle="link"
          searchLabel={<FormattedMessage id="stripes-acq-components.filter.donor.lookup" />}
          onAddDonors={selectDonor}
          isMultiSelect={false}
        />
      </div>
    </div>
  );
};

FieldDonor.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  allDonors: PropTypes.arrayOf(PropTypes.object).isRequired,
  inputValue: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  name: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};
