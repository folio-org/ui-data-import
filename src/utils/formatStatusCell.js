import { FILE_STATUSES } from './constants';

/**
 * @callback formatMessage
 */
/**
 * Returns a function that returns formatted message for the "Status" cell of a given record.
 * E.g. for record={status: 'COMMITTED', progress: {current: 1}}, returns "Completed".
 * @param {formatMessage} formatter - The callback that formats status message
 */
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
