import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';

export default server => {
  server.create('job-profile', { tags: { tagList: [] } });
  server.create('job-profile', { userInfo: { userName: SYSTEM_USER_NAME } });
  server.create('job-profile', { userInfo: { lastName: 'Doe' } });

  server.get('/data-import-profiles/jobProfiles');
};
