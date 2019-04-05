import {
  some,
  isString,
  isArray,
  get,
} from 'lodash';

const matchCaseInsensitive = (value, pattern) => value.match(new RegExp(pattern, 'i'));

export const searchEntityByQuery = params => {
  const {
    entity,
    query,
    searchPattern,
    fieldsToMatch,
  } = params;

  let [, searchTerm = ''] = query.match(searchPattern) || [];

  searchTerm = searchTerm.trim();

  if (!searchTerm) {
    return entity;
  }

  entity.models = entity.models.filter(record => {
    return some(fieldsToMatch, field => {
      const fieldValue = get(record, field);

      if (isString(fieldValue)) {
        return Boolean(matchCaseInsensitive(fieldValue, searchTerm));
      }

      if (isArray(fieldValue)) {
        return some(fieldValue, item => matchCaseInsensitive(item, searchTerm));
      }

      return false;
    });
  });

  return entity;
};
