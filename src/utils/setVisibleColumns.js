import { permissions } from './permissions';
import { DEFAULT_JOB_LOG_COLUMNS } from './jobLogsListProperties';

export const setVisibleColumns = (stripes) => {
  const hasDeletePermission = stripes.hasPerm(permissions.DELETE_LOGS);
  const visibleColumns = hasDeletePermission ?
    DEFAULT_JOB_LOG_COLUMNS :
    DEFAULT_JOB_LOG_COLUMNS.filter(column => column !== 'selected');

  return visibleColumns;
};
