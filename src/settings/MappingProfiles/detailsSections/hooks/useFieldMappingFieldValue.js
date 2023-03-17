import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { formName as MAPPING_PROFILE_FORM_NAME } from '../../MappingProfilesForm';

import { getFieldValueFromDetails } from '../utils';

/**
 *
 * @param {string[]|string} fieldNames field names stored in Redux mappingFields
 * @param {boolean} [trimQuotes=true] indicates whether quoted marks should be trimmed
 * @returns {[string|undefined]} an array of field values or undefined
 */
export const useFieldMappingFieldValue = (fieldNames, trimQuotes = true) => {
  const mappingFields = useSelector(state => {
    return state.form[MAPPING_PROFILE_FORM_NAME]?.values?.profile?.mappingDetails?.mappingFields || [];
  }, isEqual);

  const getValue = fieldName => getFieldValueFromDetails(mappingFields, fieldName, trimQuotes) || undefined;

  return Array.isArray(fieldNames) ? fieldNames.map(getValue) : [getValue(fieldNames)];
};
