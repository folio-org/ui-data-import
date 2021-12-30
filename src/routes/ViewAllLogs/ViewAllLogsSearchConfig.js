const indexes = [
  {
    label: 'jobExecutionHrId',
    value: 'hrId',
    placeholder: 'jobExecutionHrId',
  },
  {
    label: 'fileName',
    value: 'fileName',
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

export const logsSearchTemplate = query => ({
  hrId: `${query}*`,
  fileName: `*${query}*`,
});
