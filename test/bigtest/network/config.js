// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  this.get('/metadata-provider/jobExecutions', {
    jobExecutionDtos: [],
    totalRecords: 0,
  });

  this.get('/metadata-provider/logs', {
    logDtos: [],
    totalRecords: 0,
  });

  this.get('/metadata-provider/file-extensions', {
    fileExtensions: [],
    totalRecords: 0,
  });

  this.get('/data-import/upload/definition', {
    uploadDefinitions: [],
    totalRecords: 0,
  });
}
