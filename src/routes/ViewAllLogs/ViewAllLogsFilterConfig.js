import { FILTERS } from './constants';
import { NO_FILE_NAME } from '../../utils';

export const filterConfig = [
  {
    name: FILTERS.ERRORS,
    cql: FILTERS.ERRORS,
    values: [],
  },
  {
    name: FILTERS.DATE,
    cql: FILTERS.DATE,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.JOB_PROFILE,
    cql: FILTERS.JOB_PROFILE,
    values: [],
  },
  {
    name: FILTERS.USER,
    cql: FILTERS.USER,
    values: [],
  },
  {
    name: FILTERS.SINGLE_RECORD_IMPORTS,
    cql: FILTERS.JOB_PROFILE,
    operator: '=',
    noIndex: true,
    values: [
      {
        name: 'no',
        cql: [NO_FILE_NAME],
        indexName: 'fileNameNotAny',
      },
      {
        name: 'yes',
        cql: [NO_FILE_NAME],
        indexName: 'fileName',
      },
    ],
  },
];
