import { fileExtensions } from '../../mocks';

export default server => {
  server.get('/data-import/fileExtensions', {
    fileExtensions,
    totalRecords: fileExtensions.length,
  });
};
