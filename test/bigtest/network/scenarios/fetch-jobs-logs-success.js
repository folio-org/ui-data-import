import { jobsLogs as logDtos } from '../../mocks/jobs-logs';

export default server => {
  server.get('/metadata-provider/logs', {
    logDtos,
    totalRecords: logDtos.length,
  });
};
