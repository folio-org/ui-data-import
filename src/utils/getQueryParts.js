import { startsWith } from 'lodash';

import { validateSearchString } from './validateSearchString';

export const getSearchQuery = (queryTemplate, searchString) => {
  const validSearchString = validateSearchString(searchString);

  return queryTemplate.replace(/%{query\.query}/g, validSearchString);
};

export const getSortQuery = (sortMap, sortValues) => {
  const isSortDescending = sortValue => startsWith(sortValue, '-');
  const replaceMinusWithDescending = sortItem => {
    return sortMap[sortItem.slice(1)]
      .split(' ')
      .map(item => `${item}/sort.descending`)
      .join(' ');
  };

  return sortValues
    .split(',')
    .map(sortItem => (isSortDescending(sortItem) ? replaceMinusWithDescending(sortItem) : sortMap[sortItem]))
    .join(' ');
};
