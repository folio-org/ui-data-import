import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { formName as MAPPING_PROFILE_FORM_NAME } from '../../MappingProfilesForm';

import { getRefValuesFromTables } from '../utils';
import { getReferenceTables } from '../../initialDetails';

/**
 *
 * @param {string[]|string} fieldPaths field names stored in Redux mappingFields
 * @returns {[[Object]|[]]} an array of objects with field properties or empty arrays
 */
export const useFieldMappingRefValues = fieldPaths => {
  const mappingFields = useSelector(state => {
    return state.form[MAPPING_PROFILE_FORM_NAME]?.values?.profile?.mappingDetails?.mappingFields || [];
  }, isEqual);
  const referenceTables = getReferenceTables(mappingFields);

  const getValue = path => getRefValuesFromTables(referenceTables, path) || [];

  return Array.isArray(fieldPaths) ? fieldPaths.map(getValue) : [getValue(fieldPaths)];
};
