import { createContext } from 'react';
import { noop } from 'lodash';

export const UploadingJobsContext = createContext({
  uploadDefinition: {},
  updateUploadDefinition: noop,
  deleteUploadDefinition: noop,
  uploadConfiguration: {},
  updateStorageKeys: noop,
  storageKeys: []
});
