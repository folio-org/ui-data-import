import { jobExecutions as jobExecutionDtos } from '../../mocks';

export default server => {
  server.get('/metadata-provider/jobExecutions', {
    jobExecutionDtos,
    totalRecords: jobExecutionDtos.length,
  });
};
