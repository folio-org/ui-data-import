import { setVisibleColumns } from '../setVisibleColumns';
import { permissions } from '../permissions';
import { DEFAULT_JOB_LOG_COLUMNS } from '../jobLogsListProperties';


describe('setVisibleColumns function', () => {
  describe('when user has permissions to delete logs', () => {
    it('should return all the visible columns', () => {
      const stripes = {
        hasPerm: perm => perm === permissions.DELETE_LOGS
      };

      expect(setVisibleColumns(stripes)).toEqual(DEFAULT_JOB_LOG_COLUMNS);
    });
  });

  describe('when user has no permissions to delete logs', () => {
    it('should return all the visible columns except checkbox column', () => {
      const stripes = {
        hasPerm: perm => perm === 'test permission'
      };
      const visibleColumns = DEFAULT_JOB_LOG_COLUMNS.filter(column => column !== 'selected');

      expect(setVisibleColumns(stripes)).toEqual(visibleColumns);
    });
  });
});

