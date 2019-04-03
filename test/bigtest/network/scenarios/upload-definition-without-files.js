export default server => {
  server.create('upload-definition', { fileDefinitions: [] });
  server.get('/data-import/uploadDefinitions');
  server.delete('/data-import/uploadDefinitions/:id');
};
