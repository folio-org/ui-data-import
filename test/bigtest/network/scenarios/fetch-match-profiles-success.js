import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';

export default server => {
  server.create('match-profile', { tags: { tagList: [] } });
  server.create('match-profile', { userInfo: { userName: SYSTEM_USER_NAME } });
  server.create('match-profile', { userInfo: { lastName: 'Doe' } });

  server.get('/data-import-profiles/matchProfiles');
};
