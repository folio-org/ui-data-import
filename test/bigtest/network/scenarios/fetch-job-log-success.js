import { jobLog } from '../../mocks/job-log';

export default server => {
  server.get('/source-storage/records', {
    records: jobLog,
    totalRecords: jobLog.length,
  });
};
