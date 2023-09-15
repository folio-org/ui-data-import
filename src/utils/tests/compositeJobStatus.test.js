import {
  calculateJobSliceStats,
  calculateJobRecordsStats,
  collectCompositeJobValues,
  calculateCompositeProgress,
  inProgressStatuses,
  failedStatuses,
  completeStatuses,
} from '../compositeJobStatus';

const mockJob = {
  compositeDetails: {
    fileUploadedState:{ totalRecordsCount: 100, currentlyProcessedCount: 33, chunksCount: 10},
    parsingInProgressState:{ totalRecordsCount: 100, currentlyProcessedCount: 33, chunksCount: 10},
    parsingFinishedState:{ totalRecordsCount: 100, currentlyProcessedCount: 33, chunksCount: 10},
    processingInProgressState:{ totalRecordsCount: 100, currentlyProcessedCount: 33, chunksCount: 10},
    processingFinishedState:{ totalRecordsCount: 100, currentlyProcessedCount: 33, chunksCount: 10},
    commitInProgressState:{ totalRecordsCount: 100, currentlyProcessedCount: 33, chunksCount: 10},
    errorState:{ totalRecordsCount: 50, currentlyProcessedCount: 10, chunksCount: 30},
    discardedState:{ totalRecordsCount: 50, currentlyProcessedCount: 10, chunksCount: 30},
    cancelledState:{ totalRecordsCount: 50, currentlyProcessedCount: 10, chunksCount: 30},
    committedState:{ totalRecordsCount: 4, currentlyProcessedCount: 2, chunksCount: 50}
  }
};

const mockNaNJob = {
  compositeDetails: {
    fileUploadedState:{ chunksCount: 10},
    parsingInProgressState:{ chunksCount: 10},
    parsingFinishedState:{ chunksCount: 10},
    processingInProgressState:{ chunksCount: 10},
    processingFinishedState:{ chunksCount: 10},
    commitInProgressState:{ chunksCount: 10},
    errorState:{ chunksCount: 30},
    discardedState:{ chunksCount: 30},
    cancelledState:{ chunksCount: 30},
    committedState:{ chunksCount: 50}
  }
};

describe('compositeJobStatus utilities', () => {
  describe('calculateJobSliceStats -', () => {
    it('calculates total in-progress slices as expected.', () => {
      expect(calculateJobSliceStats(mockJob.compositeDetails, inProgressStatuses)).toEqual(60);
    });
    it('calculates total error slices as expected.', () => {
      expect(calculateJobSliceStats(mockJob.compositeDetails, failedStatuses)).toEqual(90);
    });
    it('calculates total complete slices as expected.', () => {
      expect(calculateJobSliceStats(mockJob.compositeDetails, completeStatuses)).toEqual(50);
    });
  });

  describe('calculateJobRecordsStats -', () => {
    it('calculates total in-progress records as expected.', () => {
      expect(calculateJobRecordsStats(mockJob.compositeDetails, inProgressStatuses)).toEqual({ processedRecords: 198, totalRecords: 600 });
    });
    it('calculates total error records as expected.', () => {
      expect(calculateJobRecordsStats(mockJob.compositeDetails, failedStatuses)).toEqual({ processedRecords: 30, totalRecords: 150 });
    });
    it('calculates total complete records as expected.', () => {
      expect(calculateJobRecordsStats(mockJob.compositeDetails, completeStatuses)).toEqual({ processedRecords: 2, totalRecords: 4 });
    });
  });

  describe('calculateJobRecordsStats - NaN handling...', () => {
    it('calculates total in-progress records as expected.', () => {
      expect(calculateJobRecordsStats(mockNaNJob.compositeDetails, inProgressStatuses)).toEqual({ processedRecords: 0, totalRecords: 0 });
    });
    it('calculates total error records as expected.', () => {
      expect(calculateJobRecordsStats(mockNaNJob.compositeDetails, failedStatuses)).toEqual({ processedRecords: 0, totalRecords: 0 });
    });
    it('calculates total complete records as expected.', () => {
      expect(calculateJobRecordsStats(mockNaNJob.compositeDetails, completeStatuses)).toEqual({ processedRecords: 0, totalRecords: 0 });
    });
  });

  describe('collectCompositeJobValues -', () => {
    it('calculates composite values object as expected', () => {
      expect(collectCompositeJobValues(mockJob)).toEqual({
        inProgressSliceAmount: 60,
        completedSliceAmount: 50,
        erroredSliceAmount: 30,
        failedSliceAmount: 90,
        totalSliceAmount: 200,
        inProgressRecords: {
          processedRecords: 198,
          totalRecords: 600,
        },
        completedRecords: {
          processedRecords: 2,
          totalRecords: 4,
        },
        failedRecords: {
          processedRecords: 30,
          totalRecords: 150,
        }
      });
    });
  });

  describe('calculateCompositeProgress -', () => {
    const {
      inProgressRecords,
      completedRecords,
      failedRecords
    } = collectCompositeJobValues(mockJob);
    const prevProgress = { processed: 80, total: 90 };
    const updateProgressMock = jest.fn();

    beforeEach(() => {
      updateProgressMock.mockReset();
    });
    it('calculates progress as expected', () => {
      expect(calculateCompositeProgress({
        inProgressRecords,
        completedRecords,
        failedRecords
      })).toEqual({ total: 754, processed: 230 });
    });
    it('if progress percent is greater than 100%, return 100%', () => {
      expect(calculateCompositeProgress(
        {
          inProgressRecords : { totalRecords: 100, processedRecords: 200 },
          completedRecords: { totalRecords: 100, processedRecords: 200 },
          failedRecords: { totalRecords: 100, processedRecords: 200 }
        }, prevProgress
      )).toEqual({ total: 100, processed: 100 });
    });
    it('if supplied values are NaN, return a 0 percentage...', () => {
      expect(calculateCompositeProgress({
        inProgressRecords : { processedRecords: 200 },
        completedRecords: { processedRecords: 200 },
        failedRecords: { processedRecords: 200 }
      }, prevProgress)).toEqual({ total: 100, processed: 0 });
    });
    it('if result and previous are the same, do not call updateProgress', () => {
      expect(calculateCompositeProgress({
        inProgressRecords : { processedRecords: 200 },
        completedRecords: { processedRecords: 200 },
        failedRecords: { processedRecords: 200 }
      },
      { total: 100, processed: 0 },
      updateProgressMock)).toEqual({ total: 100, processed: 0 });
      expect(updateProgressMock).not.toHaveBeenCalled();
    });
    it('if result and previous are different, do not call updateProgress', () => {
      expect(calculateCompositeProgress(
        {
          inProgressRecords : { totalRecords: 100, processedRecords: 10 },
          completedRecords: { totalRecords: 100, processedRecords: 50 },
          failedRecords: { totalRecords: 0, processedRecords: 0 }
        },
        { total: 100, processed: 30 },
        updateProgressMock
      )).toEqual({ total: 100, processed: 50 });
      expect(updateProgressMock).toHaveBeenCalled();
    });
  });
});
