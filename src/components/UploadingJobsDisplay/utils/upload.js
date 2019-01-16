import { addHeaders } from '../../../utils/api';
import createUrl from '../../../utils/createUrl';

const onFileUploadError = error => {
  console.error(error); // eslint-disable-line no-console
};

const convertBytesToKilobytes = size => Math.ceil(size / 1024);

export const updateFilesWithFileDefinitionMetadata = (files, fileDefinitions) => {
  const updatedFiles = { ...files };

  fileDefinitions.forEach(definition => {
    const {
      uiKey,
      id,
      uploadDefinitionId,
    } = definition;

    updatedFiles[uiKey] = {
      ...updatedFiles[uiKey],
      id,
      uploadDefinitionId,
    };
  });

  return updatedFiles;
};

const generateFileDefinitionsBody = files => {
  const fileDefinitions = Object
    .keys(files)
    .reduce((res, key) => res.concat({
      uiKey: key,
      size: convertBytesToKilobytes(files[key].size),
      name: files[key].name,
    }), []);

  return { fileDefinitions };
};

export const createFileDefinition = (files, url, headers) => {
  const filesDefinition = generateFileDefinitionsBody(files);
  const config = {
    method: 'POST',
    headers,
    body: JSON.stringify(filesDefinition),
  };

  return fetch(url, config)
    .then(res => res.json());
};

export const uploadFile = (file, fileMeta, url, headers, onprogress) => {
  return new Promise(async (resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr = addHeaders(
      xhr,
      headers,
    );

    try {
      xhr.upload.onprogress = onprogress.bind(null, fileMeta.key);
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }

        const response = {
          status: xhr.status,
          statusText: xhr.statusText,
          body: xhr.response,
          file,
        };

        if (xhr.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.send(file);
    } catch (e) {
      onFileUploadError(e);
    }
  });
};

export const uploadFiles = (
  files,
  filesMeta,
  url,
  headers,
  onXHRprogress,
  onXHRload,
  onXHRerror,
) => {
  let promise = Promise.resolve();

  Object
    .keys(filesMeta)
    .forEach((key, i) => {
      const fileMeta = filesMeta[key];
      const urlWithQueryParams = createUrl(url, {
        fileId: fileMeta.id,
        uploadDefinitionId: fileMeta.uploadDefinitionId,
      });

      promise = promise
        .then(() => uploadFile(files[i], fileMeta, urlWithQueryParams, headers, onXHRprogress))
        .then(response => onXHRload(JSON.parse(response.body), fileMeta.key))
        .catch((response) => onXHRerror(response, fileMeta.key));
    });
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

export const deleteFile = (url, headers) => {
  const config = {
    method: 'DELETE',
    headers,
  };

  return fetch(url, config)
    .then(processDeleteResponse);
};
