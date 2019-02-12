import { fileExtensions } from '../../mocks';

export default server => {
  server.get('/metadata-provider/fileExtension', {
    fileExtensions,
    totalRecords: fileExtensions.length,
  });
};
