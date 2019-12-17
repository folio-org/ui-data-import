import fileExtensions from './fetch-file-extensions-success';
import restoreDefaultFileExtensions from './restore-default-file-extensions-success';
import jobProfiles from './fetch-job-profiles-success';
import matchProfiles from './fetch-match-profiles-success';
import actionProfiles from './fetch-action-profiles-success';
import mappingProfiles from './fetch-mapping-profiles-success';
import deleteFile from './delete-file-success';
import uploadingFiles from './uploading-files';
import tagsEnabled from './tags-enabled';
import tags from './fetch-tags';
import users from './fetch-users';
import loadRecords from './load-records';
import jobs from './fetch-jobs-data-success';
import jobsLogs from './fetch-jobs-logs-success';
import jobLogs from './fetch-job-log-success';
import modules from './fetch-modules';

export default function defaultScenario(server) {
  fileExtensions(server);
  jobProfiles(server);
  matchProfiles(server);
  actionProfiles(server);
  mappingProfiles(server);
  deleteFile(server);
  uploadingFiles(server);
  tagsEnabled(server);
  restoreDefaultFileExtensions(server);
  tags(server);
  users(server);
  loadRecords(server);
  jobs(server);
  jobsLogs(server);
  jobLogs(server);
  modules(server);
}
