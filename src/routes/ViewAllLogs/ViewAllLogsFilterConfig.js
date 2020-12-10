import {
  FILTERS,
  LOGS_FILTER,
} from './constants';
import {
  OCLC_CREATE_INSTANCE_ID,
  OCLC_UPDATE_INSTANCE_ID,
} from '../../utils';

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
  {
    name: FILTERS.SINGLE_RECORD_IMPORTS,
    cql: FILTERS.JOB_PROFILE,
    operator: '=',
    values: [
      {
        name: 'no',
        cql: `\\“id\\“==" NOT jobProfileInfo="\\“id\\“=="${OCLC_CREATE_INSTANCE_ID}") 
        AND (jobProfileInfo="\\“id\\“==" NOT jobProfileInfo="\\“id\\“=="${OCLC_UPDATE_INSTANCE_ID}"`,
      },
      {
        name: 'yes',
        cql: `\\“id\\“==${OCLC_CREATE_INSTANCE_ID}") OR (jobProfileInfo="\\“id\\“==${OCLC_UPDATE_INSTANCE_ID}`,
      },
    ],
  },
];
