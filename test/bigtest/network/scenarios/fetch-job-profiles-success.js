import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';
import { searchEntityByQuery } from '../../helpers';

export default server => {
  server.create('job-profile', {
    name: 'Approval plan records',
    tags: { tagList: ['acq', 'cat', 'weekly'] },
    dataType: ['MARC'],
  });
  server.create('job-profile', {
    name: 'Create orders from acquisitions',
    tags: { tagList: ['acq'] },
    dataType: ['MARC'],
    userInfo: {
      userName: SYSTEM_USER_NAME,
    },
  });
  server.create('job-profile', {
    name: 'DDA discovery records',
    tags: { tagList: [] },
    dataType: ['MARC'],
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

  server.get('/data-import-profiles/jobProfiles/:id');

  server.put('/data-import-profiles/jobProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const jobProfileModel = schema.jobProfiles.find(id);
    const updatedJobProfile = JSON.parse(requestBody);

    jobProfileModel.update({ ...updatedJobProfile });

    return jobProfileModel.attrs;
  });
};
