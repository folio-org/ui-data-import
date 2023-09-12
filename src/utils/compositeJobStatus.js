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
      if (!Number.isNaN(obj[status].totalRecordsCount)) totalRecords += obj[status].totalRecordsCount;
      if (!Number.isNaN(obj[status].currentlyProcessedCount)) processedRecords += obj[status].currentlyProcessedCount;
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

export const calculateCompositeProgress = ({ totalSliceAmount, failedSliceAmount, completedSliceAmount }, { inProgressRecords, completedRecords, failedRecords }, previousProgress = { processed: 0, total: 100 }, updateProgress = noop) => {
  const recordBaseProgress = { totalRecords: 0, processedRecords: 0 };
  let recordProgress = [inProgressRecords, completedRecords, failedRecords].reduce((acc, curr) => {
    return {
      totalRecords: acc.totalRecords + curr.totalRecords,
      processedRecords: acc.processedRecords + curr.processedRecords,
    };
  }, recordBaseProgress);

  recordProgress = {
    total: recordProgress.totalRecords,
    processed: recordProgress.processedRecords
  };

  const sliceProgress = {
    total: totalSliceAmount,
    processed: failedSliceAmount + completedSliceAmount,
  };

  const recordPercent = recordProgress.processed / recordProgress.total;
  const slicePercent = sliceProgress.processed / sliceProgress.total;
  let accProgress = (recordPercent > slicePercent) ? sliceProgress : recordProgress;

  // Ensure progress does not diminish.
  if ((previousProgress.processed / previousProgress.total) > (accProgress.processed / accProgress.total)) {
    accProgress = previousProgress;
  }

  // Ensure that progress doesn't extend beyond 100%
  const adjustedPercent = accProgress.processedRecords / accProgress.totalRecords;
  if (adjustedPercent > 1.0) {
    accProgress.total = 100;
    accProgress.processed = 100;
  }

  // replace any NaN values with numbers for total. Avoid dividing by zero.
  // this attempts to resolve any NaN display problems when a job is early in the submission process.
  if (Number.isNaN(accProgress.processed)) accProgress.processed = 0;
  if (Number.isNaN(accProgress.total) || accProgress.total === 0) accProgress.total = 100;

  return accProgress;
};