import { createContext } from 'react';
import { noop } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const UploadingJobsContext = createContext({
  files: null,
  setFiles: noop,
  uploadDefinition: null,
  updateUploadDefinition: noop,
  deleteUploadDefinition: noop,
});
