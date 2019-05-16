import { jobLog } from '../../mocks/job-log';

export default server => {
  server.get('/source-storage/sourceRecords', {
    sourceRecords: jobLog,
    totalRecords: jobLog.length,
  });
};
