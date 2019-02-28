export default async server => {
  server.create('file-extension');
  server.create('file-extension', { userInfo: { userName: 'System' } });
  server.create('file-extension', {
    dataTypes: [],
    userInfo: {
      lastName: 'Doe',
    },
  });

  server.get('/data-import/fileExtensions');
  server.get('/data-import/fileExtensions/:id');
  server.post('/data-import/fileExtensions', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('file-extension', params);

    return record.attrs;
  });
};
