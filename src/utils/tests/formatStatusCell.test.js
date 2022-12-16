import '../../../test/jest/__mock__';

import { statusCellFormatter } from '../formatStatusCell';
import { FILE_STATUSES } from '../constants';

describe('statusCellFormatter function', () => {
  const formatMessage = jest.fn();

  afterEach(() => {
    formatMessage.mockReset();
  });

  it('should return a function', () => {
    expect(typeof statusCellFormatter(jest.fn())).toBe('function');
  });

  describe('when job status is COMMITTED', () => {
    it('should be called with appropriate arguments', () => {
      const record = { status: FILE_STATUSES.COMMITTED };
      const formatter = statusCellFormatter(formatMessage);

      formatter(record);

      expect(formatMessage).toHaveBeenCalledWith({ id: 'ui-data-import.completed' });
    });
  });

  describe('when job status is ERROR', () => {
    it('should called with appropriate arguments', () => {
      const record = { status: FILE_STATUSES.ERROR, progress: { current: 0 } };
      const formatter = statusCellFormatter(formatMessage);

      formatter(record);

      expect(formatMessage).toHaveBeenCalledWith({ id: 'ui-data-import.failed' });
    });

    describe('and job is already in progress', () => {
      it('should called with appropriate arguments', () => {
        const record = { status: FILE_STATUSES.ERROR, progress: { current: 1 } };
        const formatter = statusCellFormatter(formatMessage);

        formatter(record);

        expect(formatMessage).toHaveBeenCalledWith({ id: 'ui-data-import.completedWithErrors' });
      });
    });
  });

  describe('when job status is CANCELLED', () => {
    it('should be called with appropriate arguments', () => {
      const record = { status: FILE_STATUSES.CANCELLED };
      const formatter = statusCellFormatter(formatMessage);

      formatter(record);

      expect(formatMessage).toHaveBeenCalledWith({ id: 'ui-data-import.stoppedByUser' });
    });
  });
});
