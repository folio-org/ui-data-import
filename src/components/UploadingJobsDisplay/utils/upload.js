import { FILE_STATUSES } from '../../../utils/constants';

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

export const createUploadDefinition = async (files, url, headers) => {
  const filesDefinition = generateUploadDefinitionBody(files);
  const config = {
    method: 'POST',
    headers,
    body: JSON.stringify(filesDefinition),
  };

  try {
    const response = await fetch(url, config);
    const responseJSON = await response.json();
    const { errors } = responseJSON;
    const hasAPIErrors = errors && errors.length > 0;

    if (hasAPIErrors) {
      return [errors[0].message, responseJSON];
    }

    if (!response.ok) {
      return ['unable to create upload definition'];
    }

    return [null, responseJSON];
  } catch (error) {
    return [error.message];
  }
};

const processDeleteResponse = response => {
  const {
    status,
    statusText,
  } = response;

  if (status !== 204) {
    const error = {
      status,
      statusText,
    };

    throw new Error(error);
  }
};

export const deleteFile = async (url, headers) => {
  const config = {
    method: 'DELETE',
    headers,
  };

  const response = await fetch(url, config);

  processDeleteResponse(response);
};
