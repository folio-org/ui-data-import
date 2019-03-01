export default server => {
  server.post('/data-import/fileExtensions/restore/default', data => {
    const models = data.fileExtensions.all().models;

    // remove last record
    models.pop().destroy();

    return {
      fileExtensions: models.map(model => model.attrs),
      totalRecords: 0,
    };
  });
};
