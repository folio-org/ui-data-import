import { jobExecutionDtos } from '../../mocks/jobExecutionMocks';

export default server => {
  server.get('/metadata-provider/jobExecutions', {
    jobExecutionDtos,
    totalRecords: jobExecutionDtos.length,
  });
};
