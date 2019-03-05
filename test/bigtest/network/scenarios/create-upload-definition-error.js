export default server => {
  server.get('/data-import/uploadDefinitions');
  server.post('/data-import/uploadDefinitions', {}, 500);
};
