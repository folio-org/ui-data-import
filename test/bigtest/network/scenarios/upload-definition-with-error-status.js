export default server => {
  server.create('upload-definition', {
    status: 'ERROR',
    fileDefinitions: [
      { status: 'ERROR' },
      { status: 'ERROR' },
      { status: 'ERROR' },
    ],
  });
  server.get('/data-import/uploadDefinitions');
  server.delete('/data-import/uploadDefinitions/:id');
};
