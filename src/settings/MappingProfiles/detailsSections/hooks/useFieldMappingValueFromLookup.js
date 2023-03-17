import {
  getMappingQueryFromValue,
  getMatchByUuidInQuotes,
} from '../utils';
import { useFieldMappingFieldValue } from './useFieldMappingFieldValue';

/**
 *
 * @param {string} fieldName field name stored in Redux mappingFields
 * @returns {[string|null, string|undefined]} an array of selected uuid and mapping query if exists
 */
export const useFieldMappingValueFromLookup = fieldName => {
  const [valueFromDetails] = useFieldMappingFieldValue([fieldName], false);

  const uuid = getMatchByUuidInQuotes(valueFromDetails);
  const mappingQuery = getMappingQueryFromValue(uuid);

  return [uuid, mappingQuery];
};
