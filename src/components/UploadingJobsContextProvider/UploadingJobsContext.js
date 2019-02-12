import { createContext } from 'react';
import { noop } from 'lodash';

export const UploadingJobsContext = createContext({
  files: [],
  setFiles: noop,
  uploadDefinition: {},
  updateUploadDefinition: noop,
  deleteUploadDefinition: noop,
});
