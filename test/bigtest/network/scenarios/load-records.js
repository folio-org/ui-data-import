import { faker } from '@bigtest/mirage';

import { FILE_STATUSES } from '../../../../src/utils/constants';

export default server => {
  const uploadDefinitionId = faker.random.uuid();

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
  server.get('/data-import-profiles/jobProfiles/:id', {
    id: faker.random.uuid(),
    name: 'Create MARC Bibs',
    dataType: 'MARC',
  });

  server.post('/data-import/uploadDefinitions/:id/processFiles', {}, 200);
};
