import { createContext } from 'react';
import { noop } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const UploadingJobsContext = createContext({
  files: [],
  setFiles: noop,
  uploadDefinition: {},
  updateUploadDefinition: noop,
  deleteUploadDefinition: noop,
});
