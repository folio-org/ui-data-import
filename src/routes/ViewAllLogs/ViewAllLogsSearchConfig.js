const indexes = [
  {
    label: 'fileName',
    value: 'fileName',
  },
  {
    label: 'hrId',
    value: 'hrId',
  },
  {
    label: 'uuId',
    value: 'id',
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
fileName="%{query.query}*" OR 
id="%{query.query}*")`;
