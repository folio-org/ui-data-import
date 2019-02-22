export default server => {
  server.createList('file-extension', 3);
  server.get('/data-import/fileExtensions');
  server.get('/data-import/fileExtensions/:id');
  server.post('/data-import/fileExtensions', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('file-extension', params);

    return record.attrs;
  });
};
