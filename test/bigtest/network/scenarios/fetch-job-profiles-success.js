import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';
import { searchEntityByQuery } from '../../helpers';

export default server => {
  server.create('job-profile', {
    name: 'Approval plan records',
    tags: { tagList: ['acq', 'cat', 'weekly'] },
  });
  server.create('job-profile', {
    name: 'Create orders from acquisitions',
    tags: { tagList: ['acq'] },
    userInfo: {
      userName: SYSTEM_USER_NAME,
    },
  });
  server.create('job-profile', {
    name: 'DDA discovery records',
    tags: { tagList: [] },
    userInfo: { lastName: 'Doe' },
  });

  server.get('/data-import-profiles/jobProfiles', (schema, request) => {
    const { query = '' } = request.queryParams;
    const jobProfiles = schema.jobProfiles.all();
    const searchPattern = /name="(\w+)/;

    return searchEntityByQuery({
      query,
      entity: jobProfiles,
      searchPattern,
      fieldsToMatch: ['name', 'tags.tagList'],
    });
  });

  server.post('/data-import-profiles/jobProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('job-profile', params);

    return record.attrs;
  });
};
