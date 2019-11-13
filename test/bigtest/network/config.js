// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  this.get('/metadata-provider/jobExecutions', {
    jobExecutions: [],
    totalRecords: 0,
  });

  this.get('/data-import/fileExtensions', {
    fileExtensions: [],
    totalRecords: 0,
  });

  this.get('/data-import/uploadDefinitions', {
    uploadDefinitions: [],
    totalRecords: 0,
  });

  this.get('/data-import-profiles/actionProfiles', {
    actionProfiles: [],
    totalRecords: 0,
  });

  this.get('/data-import-profiles/jobProfiles', {
    jobProfiles: [],
    totalRecords: 0,
  });

  this.get('/data-import-profiles/mappingProfiles', {
    mappingProfiles: [],
    totalRecords: 0,
  });

  this.get('/data-import-profiles/matchProfiles', {
    matchProfiles: [],
    totalRecords: 0,
  });

  this.get('/metadata-provider/jobExecutions', {
    jobExecutions: [],
    totalRecords: 0,
  });

  this.get('/data-import-profiles/profileAssociations/:id/masters', {
    profileAssociations: [],
    totalRecords: 0,
  });

  this.get('/data-import-profiles/profileAssociations/:id/details', {
    profileAssociations: [],
    totalRecords: 0,
  });

  this.get('/tags', {
    tags: [],
    totalRecords: 0,
  });

  this.get('/users', {
    users: [],
    totalRecords: 0,
  });
}
