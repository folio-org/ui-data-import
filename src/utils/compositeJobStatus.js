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
    if (Object.hasOwn(obj, status)) {
      totalSlices += obj[status].chunksCount;
    }
  });
  return totalSlices;
};

export const calculateJobRecordsStats = (obj, arr) => {
  let totalRecords = 0;
  let processedRecords = 0;
  arr.forEach((status) => {
    if (Object.hasOwn(obj, status)) {
      // disable eslint here - Number.isNaN will return true if the value is anything besides NaN. i.e. Number.isNaN(undefined) = false.
      if (!isNaN(obj[status].totalRecordsCount)) totalRecords += obj[status].totalRecordsCount; // eslint-disable-line no-restricted-globals
      if (!isNaN(obj[status].currentlyProcessedCount)) processedRecords += obj[status].currentlyProcessedCount; // eslint-disable-line no-restricted-globals
    }
  });
  return { totalRecords, processedRecords };
};

export const collectCompositeJobValues = (jobEntry) => {
  const {
    compositeDetails,
  } = jobEntry;

  const inProgressSliceAmount = calculateJobSliceStats(
    compositeDetails,
    inProgressStatuses
  );

  const completedSliceAmount = calculateJobSliceStats(
    compositeDetails,
    completeStatuses
  );

  const erroredSliceAmount = calculateJobSliceStats(
    compositeDetails,
    ['errorState']
  );

  const failedSliceAmount = calculateJobSliceStats(
    compositeDetails,
    failedStatuses,
  );

  const totalSliceAmount = inProgressSliceAmount + completedSliceAmount + failedSliceAmount;

  const inProgressRecords = calculateJobRecordsStats(
    compositeDetails,
    inProgressStatuses,
  );

  const completedRecords = calculateJobRecordsStats(
    compositeDetails,
    completeStatuses,
  );

  const failedRecords = calculateJobRecordsStats(
    compositeDetails,
    failedStatuses,
  );

  return {
    inProgressSliceAmount,
    completedSliceAmount,
    erroredSliceAmount,
    failedSliceAmount,
    totalSliceAmount,
    inProgressRecords,
    completedRecords,
    failedRecords
  };
};

export const calculateCompositeProgress = ({
  inProgressRecords,
  completedRecords,
  failedRecords,
},
totalRecords,
previousProgress = { processed: 0, total: 100 },
updateProgress = () => {}) => {
  const recordBaseProgress = { totalRecords: 0, processedRecords: 0 };
  let recordProgress = [inProgressRecords, completedRecords, failedRecords].reduce((acc, curr) => {
    return {
      processedRecords: acc.processedRecords + curr.processedRecords,
    };
  }, recordBaseProgress);

  recordProgress = {
    total: totalRecords,
    processed: recordProgress.processedRecords
  };

  // Ensure progress does not diminish.
  if ((previousProgress.processed / previousProgress.total) > (recordProgress.processed / recordProgress.total)) {
    recordProgress = previousProgress;
  }

  // Ensure that progress doesn't extend beyond 100%
  const adjustedPercent = recordProgress.processed / recordProgress.total;
  if (adjustedPercent > 1.0) {
    recordProgress.total = 100;
    recordProgress.processed = 100;
  }

  // replace any NaN values with numbers for total. Avoid dividing by zero.
  // this attempts to resolve any NaN display problems when a job is early in the submission process
  // we disable eslint here - Number.isNaN will return true if the value is anything besides NaN.
  if (isNaN(recordProgress.processed)) recordProgress.processed = 0; // eslint-disable-line no-restricted-globals
  if (isNaN(recordProgress.total) || recordProgress.total === 0) { // eslint-disable-line no-restricted-globals
    recordProgress.total = 100;
    recordProgress.processed = 0;
  }

  if (previousProgress.processed !== recordProgress.processed) {
    updateProgress(recordProgress);
  }

  return recordProgress;
};
