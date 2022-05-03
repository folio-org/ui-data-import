import { FILTER_SEPARATOR, FILTER_GROUP_SEPARATOR } from '@folio/stripes/components';
import { logsSearchTemplate } from './ViewAllLogsSearchConfig';
import { filterConfig } from './ViewAllLogsFilterConfig';
import { SORT_MAP } from './constants';

export const getQuery = (query, qindex) => {
  if (query && qindex) {
    return { [qindex]: logsSearchTemplate(query)[qindex] };
  }

  if (query) {
    return logsSearchTemplate(query);
  }

  return {};
};

export const getFilters = filters => {
  const splitFiltersByGroups = () => {
    const groups = {};

    const fullNames = filters.split(FILTER_SEPARATOR);

    for (const fullName of fullNames) {
      if (fullName) {
        const [groupName, fieldName] = fullName.split(FILTER_GROUP_SEPARATOR);

        if (groups[groupName] === undefined) groups[groupName] = [];
        groups[groupName].push(fieldName);
      }
    }

    return groups;
  };
  const getMappedValues = (values, group) => {
    return values.map(value => {
      const obj = group.values.filter(f => typeof f === 'object' && f.name === value);

      return (obj.length > 0) ? obj[0].cql : value;
    });
  };

  if (filters) {
    const groups = splitFiltersByGroups();
    const filtersObj = {};

    for (const groupName of Object.keys(groups)) {
      const group = filterConfig.filter(g => g.name === groupName)[0];

      if (group && group.cql) {
        const cqlIndex = group.cql;

        // values contains the selected filters
        const values = groups[groupName];

        const mappedValues = getMappedValues(values, group);

        if (group.isRange) {
          const { rangeSeparator = ':' } = group;
          const [start, end] = mappedValues[0].split(rangeSeparator);

          filtersObj.completedAfter = [start];
          filtersObj.completedBefore = [end];
        } else {
          const {
            noIndex,
            values: groupValues,
          } = group;

          // fill in filters object
          if (!noIndex) {
            if (filtersObj[cqlIndex] === undefined) filtersObj[cqlIndex] = [];

            filtersObj[cqlIndex] = [...filtersObj[cqlIndex], ...values];
          } else {
            values.forEach(value => {
              const obj = groupValues.filter(f => typeof f === 'object' && f.name === value);

              if (obj.length > 0) {
                const groupIndex = obj[0].indexName;

                if (filtersObj[groupIndex] === undefined) filtersObj[groupIndex] = [];

                filtersObj[groupIndex] = [...filtersObj[groupIndex], ...obj[0].cql];
              }
            });
          }
        }
      }
    }

    return filtersObj;
  }

  return {};
};

export const getSort = sort => {
  const firstSortIndex = sort?.split(',')[0] || '';

  if (!firstSortIndex) return {};

  let reverse = false;
  let sortValue = firstSortIndex;

  if (firstSortIndex.startsWith('-')) {
    sortValue = firstSortIndex.substr(1);
    reverse = true;
  }

  let sortIndex = SORT_MAP[sortValue] || sortValue;

  if (reverse) {
    sortIndex = sortIndex.split(' ').map(v => `${v},desc`);
  } else {
    sortIndex = sortIndex.split(' ').map(v => `${v},asc`);
  }

  return { sortBy: sortIndex };
};
