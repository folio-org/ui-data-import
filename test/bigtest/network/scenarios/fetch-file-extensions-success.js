export default server => {
  server.create('file-extension', { importBlocked: false });
  server.create('file-extension', { userInfo: { userName: 'System' } });
  server.create('file-extension', {
    dataTypes: [],
    userInfo: { lastName: 'Doe' },
  });

  server.get('/data-import/fileExtensions');
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
};
