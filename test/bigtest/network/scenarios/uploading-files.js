import { faker } from '@bigtest/mirage';

import { FILE_STATUSES } from '../../../../src/utils/constants';

export default server => {
  server.get('/data-import/uploadDefinitions');
  server.post('/data-import/uploadDefinitions', (schema, request) => {
    const { fileDefinitions: files } = JSON.parse(request.requestBody);

    const uploadDefinitionId = faker.random.uuid();

    const fileDefinitions = files.map(file => ({
      id: faker.random.uuid(),
      uploadDefinitionId,
      status: FILE_STATUSES.NEW,
      ...file,
    }));
    const { attrs } = server.create('upload-definition', {
      id: uploadDefinitionId,
      fileDefinitions,
    });

    return attrs;
  }, 201);
  server.post('/data-import/uploadDefinitions/:id/files/:fileId', (schema, request) => {
    const uploadDefinition = schema.uploadDefinitions.find(request.params.id);

    const { fileDefinitions } = uploadDefinition;

    const file = fileDefinitions.find(fileDefinition => fileDefinition.id === request.params.fileId);

    file.uploadedDate = new Date().toString();
    file.status = FILE_STATUSES.UPLOADED;

    uploadDefinition.update({ fileDefinitions });

    return uploadDefinition.attrs;
  }, 200, { timing: 500 });
};
