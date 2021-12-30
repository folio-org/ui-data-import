import {
  FILTERS,
  LOGS_FILTER,
} from './constants';
import {
  OCLC_CREATE_INSTANCE_JOB_ID,
  OCLC_UPDATE_INSTANCE_JOB_ID,
} from '../../utils';

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
        cql: `${OCLC_CREATE_INSTANCE_JOB_ID}&profileIdNotAny=${OCLC_UPDATE_INSTANCE_JOB_ID}`,
        indexName: 'profileIdNotAny',
      },
      {
        name: 'yes',
        cql: `${OCLC_CREATE_INSTANCE_JOB_ID}&profileIdAny=${OCLC_UPDATE_INSTANCE_JOB_ID}`,
        indexName: 'profileIdAny',
      },
    ],
  },
];
