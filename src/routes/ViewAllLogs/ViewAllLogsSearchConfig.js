import { LOGS_FILTER } from './constants';

const indexes = [
  {
    label: 'jobExecutionHrId',
    value: `${LOGS_FILTER} AND hrId`,
    placeholder: 'jobExecutionHrId',
  },
  {
    label: 'fileName',
    value: `${LOGS_FILTER} AND fileName`,
    placeholder: 'fileName',
  },
];

const keywordIndex = {
  label: 'keyword',
  value: '',
};

export const searchableIndexes = [
  keywordIndex,
  ...indexes,
];

export const logsSearchTemplate = `
(status any "COMMITTED ERROR ") AND
(hrId="%{query.query}*" OR 
fileName="%{query.query}*")`;
