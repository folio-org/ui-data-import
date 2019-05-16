export default server => {
  server.get('/data-import/uploadDefinitions');
  server.post('/data-import/uploadDefinitions', { errors: [{ message: 'upload.fileSize.invalid' }] }, 422);
};
