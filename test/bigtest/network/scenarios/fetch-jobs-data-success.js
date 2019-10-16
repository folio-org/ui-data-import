import { jobExecutions } from '../../mocks';

export default server => {
  server.get('/metadata-provider/jobExecutions', {
    jobExecutions,
    totalRecords: jobExecutions.length,
  });
};
