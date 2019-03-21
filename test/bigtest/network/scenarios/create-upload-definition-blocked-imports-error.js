export default server => {
  server.get('/data-import/uploadDefinitions');
  server.post('/data-import/uploadDefinitions', {
    errors: [{ message: 'validation.uploadDefinition.fileExtension.blocked' }],
  }, 422);
};
