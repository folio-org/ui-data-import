// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  this.get('/metadata-provider/jobExecutions', {
    jobExecutionDtos: [],
    totalItems: 0,
  });

  this.get('/metadata-provider/logs', {
    logDtos: [],
    totalItems: 0,
  });
}
