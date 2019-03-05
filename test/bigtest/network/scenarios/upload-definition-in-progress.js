export default server => {
  server.create('upload-definition');
  server.get('/data-import/uploadDefinitions');
  server.delete('/data-import/uploadDefinitions/:id', null);
};
