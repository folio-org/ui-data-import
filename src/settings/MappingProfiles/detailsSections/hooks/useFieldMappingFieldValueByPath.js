import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { formName as MAPPING_PROFILE_FORM_NAME } from '../../MappingProfilesForm';

import { getFieldValueByPath } from '../utils';

/**
 *
 * @param {string[]|string} fieldNames field names stored in Redux mappingFields
 * @returns {[string|undefined]} an array of field values or undefined
 */
export const useFieldMappingFieldValueByPath = (fieldNames) => {
  const mappingFields = useSelector(state => {
    return state.form[MAPPING_PROFILE_FORM_NAME]?.values?.profile?.mappingDetails?.mappingFields || [];
  }, isEqual);

  const getValue = fieldName => getFieldValueByPath(mappingFields, fieldName, 'value') || undefined;

  return Array.isArray(fieldNames) ? fieldNames.map(getValue) : [getValue(fieldNames)];
};
