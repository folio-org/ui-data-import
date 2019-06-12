import {
  FILE_STATUSES,
  UPLOAD_DEFINITION_STATUSES,
} from './constants';
import {
  createOkapiHeaders,
  createUrl,
} from '.';

/**
 * Converts bytes to kilobytes
 *
 * @param {number} size
 * @return {number}
 */
const convertBytesToKilobytes = size => Math.ceil(size / 1024);

/**
 * Generates Upload Definitions body data
 *
 * @param {Array} files
 * @return {{ fileDefinitions: Array }}
 */
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

/**
 * Description: TBD
 *
 * @param {Array} files
 * @returns {{ [key: string]: object }}
 */
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

/**
 * Creates Upload Definition data sets
 *
 * @param {{
 *   files: Array;
 *   url: string;
 *   okapi: object;
 * }}
 * @return {Promise<Array>}
 */
export const createUploadDefinition = async ({
  files,
  url,
  okapi,
}) => {
  const filesDefinition = generateUploadDefinitionBody(files);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...createOkapiHeaders(okapi),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filesDefinition),
  });
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

/**
 * Creates and calls file deletion request
 *
 * @param {string} url
 * @param {{ [key: string]: string }} headers
 */
export const deleteFile = async (url, headers) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};

/**
 * Creates and calls Upload Definitions retrieval request
 *
 * @param {string} url
 * @param {Object} okapi
 * @return {Promise<Object>}
 */
export const getLatestUploadDefinition = async ({
  url,
  okapi,
}) => {
  const draftJobsUrl = createUrl(url, {
    query: `(status==("${UPLOAD_DEFINITION_STATUSES.NEW}" OR "${UPLOAD_DEFINITION_STATUSES.IN_PROGRESS}" OR "${UPLOAD_DEFINITION_STATUSES.LOADED}")) sortBy createdDate/sort.descending`,
    limit: 1,
  });

  const response = await fetch(draftJobsUrl, {
    method: 'GET',
    headers: createOkapiHeaders(okapi),
  });

  if (!response.ok) {
    throw response;
  }

  const { uploadDefinitions: [latestUploadDefinition = {}] } = await response.json();

  return latestUploadDefinition;
};

/**
 * Creates and calls Upload Definition deletion request
 *
 * @param {string} url
 * @param {object} okapi
 * @return {Promise<Response>}
 */
export const deleteUploadDefinition = async ({
  url,
  okapi,
}) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: createOkapiHeaders(okapi),
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};
