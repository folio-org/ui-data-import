export default server => {
  server.delete('/data-import/uploadDefinitions/:id/files/:fileId', ({ files }, request) => {
    const id = request.params.fileId;
    const file = files.find(id);

    file.destroy();
  });
};
