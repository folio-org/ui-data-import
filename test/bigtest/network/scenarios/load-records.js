import { faker } from '@bigtest/mirage';

import {
  FILE_STATUSES,
  SYSTEM_USER_NAME,
} from '../../../../src/utils/constants';
import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';

export default server => {
  const uploadDefinitionId = faker.random.uuid();

  server.create('job-profile', {
    name: 'Approval plan records',
    tags: { tagList: ['acq', 'cat', 'weekly'] },
    dataType: ['MARC'],
  });
  server.create('job-profile', {
    name: 'Create orders from acquisitions',
    tags: { tagList: ['acq'] },
    dataType: ['MARC'],
    userInfo: { userName: SYSTEM_USER_NAME },
  });
  server.create('job-profile', {
    name: 'DDA discovery records',
    tags: { tagList: [] },
    dataType: ['Delimited'],
    userInfo: { lastName: 'Doe' },
  });

  server.create('upload-definition', {
    id: uploadDefinitionId,
    status: 'LOADED',
    fileDefinitions: [
      {
        id: faker.random.uuid(),
        name: 'importBIB017.marc',
        status: FILE_STATUSES.UPLOADED,
        uiKey: 'importBIB017.marc1492801934000',
        uploadDefinitionId,
      },
    ],
  });

  server.get('/data-import/uploadDefinitions');
  server.get('/data-import/uploadDefinitions/:id');

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
  server.get('/data-import-profiles/jobProfiles/:id');

  server.post('/data-import/uploadDefinitions/:id/processFiles', {}, 200);
};
