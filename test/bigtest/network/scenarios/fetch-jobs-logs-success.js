import { jobsLogs as logDtos } from '../../mocks/jobsLobs';

export default server => {
  server.get('/metadata-provider/logs', {
    logDtos,
    totalRecords: logDtos.length,
  });
};
