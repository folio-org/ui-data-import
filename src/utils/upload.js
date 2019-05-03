import { FILE_STATUSES, UPLOAD_DEFINTION_STATUSES } from './constants';
import {
  createOkapiHeaders,
  createUrl,
} from '.';

const convertBytesToKilobytes = size => Math.ceil(size / 1024);

const generateUploadDefinitionBody = files => {
  const fileDefinitions = Object
    .keys(files)
    .reduce((res, key) => res.concat({
      uiKey: key,
      size: convertBytesToKilobytes(files[key].size),
      name: files[key].name,
    }), []);

  return { fileDefinitions };
};

export const mapFilesToUI = (files = []) => {
  return files.reduce((res, file) => {
    // `uiKey` is needed in order to match the individual file on UI with
    // the response from the backend since it returns the all files state
    const uiKey = `${file.name}${file.lastModified}`;
    // if file is already uploaded it has already the `uiKey` and if not it should be assigned
    const key = file.uiKey || uiKey;
    const status = file.status || FILE_STATUSES.UPLOADING;

    const preparedFile = {
      id: file.id,
      uploadDefinitionId: file.uploadDefinitionId,
      key,
      name: file.name,
      size: file.size,
      loading: false,
      uploadedDate: file.uploadedDate,
      status,
      uploadedValue: 0,
      file,
    };

    return {
      ...res,
      [key]: preparedFile,
    };
  }, {});
};

export const createUploadDefinition = async ({ files, url, okapi }) => {
  const filesDefinition = generateUploadDefinitionBody(files);
  const config = {
    method: 'POST',
    headers: {
      ...createOkapiHeaders(okapi),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filesDefinition),
  };

  const response = await fetch(url, config);
  const responseJSON = await response.json();
  const { errors } = responseJSON;
  const hasAPIErrors = errors && errors.length > 0;

  if (hasAPIErrors) {
    return [errors[0].message, responseJSON];
  }

  if (!response.ok) {
    throw response;
  }

  return [null, responseJSON];
};

export const deleteFile = async (url, headers) => {
  const config = {
    method: 'DELETE',
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(response);
  }

  return response;
};

export const getLatestUploadDefinition = async ({ url, okapi }) => {
  const draftJobsUrl = createUrl(url, {
    query: `(status==("${UPLOAD_DEFINTION_STATUSES.NEW}" OR "${UPLOAD_DEFINTION_STATUSES.IN_PROGRESS}" OR "${UPLOAD_DEFINTION_STATUSES.LOADED}")) sortBy createdDate/sort.descending`,
    limit: 1,
  });

  const response = await fetch(draftJobsUrl, {
    method: 'GET',
    headers: createOkapiHeaders(okapi),
  });
  const { uploadDefinitions: [latestUploadDefinition = {}] } = await response.json();

  if (!response.ok) {
    throw response;
  }

  return latestUploadDefinition;
};

export const deleteUploadDefinition = async ({ url, okapi }) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: createOkapiHeaders(okapi),
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};
