import { Response } from '@bigtest/mirage';

import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';
import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';

export default server => {
  server.create('file-extension', {
    extension: '.mrc',
    importBlocked: false,
    dataTypes: ['MARC'],
  });
  server.create('file-extension', {
    extension: '.csv',
    dataTypes: ['EDIFACT'],
    userInfo: { userName: SYSTEM_USER_NAME },
  });
  server.create('file-extension', {
    extension: '.math',
    dataTypes: ['EDIFACT'],
    userInfo: { lastName: 'Doe' },
  });

  server.get('/data-import/fileExtensions', (schema, request) => {
    const { query = '' } = request.queryParams;
    const fileExtensions = schema.fileExtensions.all();
    const searchPattern = /extension="(\w+)/;

    return searchEntityByQuery({
      query,
      entity: fileExtensions,
      searchPattern,
      fieldsToMatch: ['extension', 'dataTypes'],
    });
  });

  server.get('/data-import/fileExtensions/:id');
  server.post('/data-import/fileExtensions', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('file-extension', params);

    return record.attrs;
  });

  server.put('/data-import/fileExtensions/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const fileExtensionModel = schema.fileExtensions.find(id);
    const updatedFileExtension = JSON.parse(requestBody);

    fileExtensionModel.update({ ...updatedFileExtension });

    return fileExtensionModel.attrs;
  });

  server.delete('/data-import/fileExtensions/:id', (schema, request) => {
    const { params: { id } } = request;
    const fileExtensionModel = schema.fileExtensions.find(id);

    fileExtensionModel.destroy();

    return new Response(200, {});
  });
};
