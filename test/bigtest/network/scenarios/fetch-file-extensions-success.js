import fileExtensions from '../../mocks/fileExtensions';

export default server => {
  server.get('/metadata-provider/fileExtension', {
    fileExtensions,
    totalRecords: fileExtensions.length,
  });
};
