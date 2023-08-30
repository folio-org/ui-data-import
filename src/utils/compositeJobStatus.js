export const inProgressStatuses = [
  'newState',
  'fileUploadedState',
  'parsingInProgressState',
  'parsingFinishedState',
  'processingInProgressState',
  'processingFinishedState',
  'commitInProgressState'
];

export const failedStatuses = [
  'errorState',
  'discardedState',
  'cancelledState'
];

export const completeStatuses = [
  'committedState'
];

export const calculateJobSliceStats = (obj, arr) => {
  let totalSlices = 0;
  arr.forEach((status) => {
    if (Object.prototype.hasOwnProperty.call(obj, status)) {
      totalSlices += obj[status].chunksCount;
    }
  });
  return totalSlices;
};

export const calculateJobRecordsStats = (obj, arr) => {
  let totalRecords = 0;
  let processedRecords = 0;
  arr.forEach((status) => {
    if (Object.prototype.hasOwnProperty.call(obj, status)) {
      if (!Number.isNaN(obj[status].totalRecordsCount)) totalRecords += obj[status].totalRecordsCount;
      if (!Number.isNaN(obj[status].currentlyProcessedCount)) processedRecords += obj[status].currentlyProcessedCount;
    }
  });
  return { totalRecords, processedRecords };
};
