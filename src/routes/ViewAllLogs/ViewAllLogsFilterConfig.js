import {
  FILTERS,
  LOGS_FILTER,
} from './constants';

export const filterConfig = [
  {
    name: FILTERS.ERRORS,
    cql: FILTERS.ERRORS,
    values: [],
  },
  {
    name: FILTERS.DATE,
    cql: `${LOGS_FILTER} AND ${FILTERS.DATE}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.JOB_PROFILE,
    cql: `${LOGS_FILTER} AND ${FILTERS.JOB_PROFILE}.id`,
    values: [],
  },
  {
    name: FILTERS.USER,
    cql: `${LOGS_FILTER} AND ${FILTERS.USER}`,
    values: [],
  },
];
