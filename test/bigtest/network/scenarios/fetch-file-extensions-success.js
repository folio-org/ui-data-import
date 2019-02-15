export default server => {
  server.createList('file-extension', 3);
  server.get('/data-import/fileExtensions');
};
