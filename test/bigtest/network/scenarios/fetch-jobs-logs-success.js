import { jobsLogs as jobExecutions } from '../../mocks/jobs-logs';

export default server => {
  server.get('/metadata-provider/jobExecutions', {
    jobExecutions,
    totalRecords: jobExecutions.length,
  });
};
