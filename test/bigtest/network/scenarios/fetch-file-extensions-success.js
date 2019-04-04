import { Response } from '@bigtest/mirage';

import { SYSTEM_USER_NAME } from '../../../../src/utils/constants';

export default server => {
  server.create('file-extension', {
    extension: '.marc',
    importBlocked: false,
    dataTypes: ['Marc'],
  });
  server.create('file-extension', {
    extension: '.csv',
    dataTypes: ['Delimited'],
    userInfo: { userName: SYSTEM_USER_NAME },
  });
  server.create('file-extension', {
    extension: '.math',
    dataTypes: ['Delimited', 'EDIFACT'],
    userInfo: { lastName: 'Doe' },
  });

  server.get('/data-import/fileExtensions', (schema, request) => {
    const { query = '' } = request.queryParams;
    let [, searchTerm = ''] = query.match(/extension="(\w+)/) || [];
    const fileExtensions = schema.fileExtensions.all();

    searchTerm = searchTerm.trim();

    if (!searchTerm) {
      return fileExtensions;
    }

    fileExtensions.models = fileExtensions.models.filter(record => {
      const {
        extension,
        dataTypes,
      } = record.attrs;

      const hasExtensionsMatch = extension.match(new RegExp(searchTerm, 'i'));
      const hasDataTypesMatch = dataTypes.some(type => type.match(new RegExp(searchTerm, 'i')));

      return hasExtensionsMatch || hasDataTypesMatch;
    });

    return fileExtensions;
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
