import { FILE_STATUSES } from './constants';

export function statusCellFormatter(formatter) {
  return record => {
    const {
      status,
      progress,
    } = record;

    if (status === FILE_STATUSES.ERROR) {
      if (progress && progress.current > 0) {
        return formatter({ id: 'ui-data-import.completedWithErrors' });
      }

      return formatter({ id: 'ui-data-import.failed' });
    }

    if (status === FILE_STATUSES.CANCELLED) {
      return formatter({ id: 'ui-data-import.stoppedByUser' });
    }

    return formatter({ id: 'ui-data-import.completed' });
  };
}
