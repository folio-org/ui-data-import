export const initMPUploadEndpoint = 'data-import/uploadUrl';
export const requestPartUploadURL = 'data-import/uploadUrl/subsequent';
export const finishMPUploadEndpoint = 'data-import/assembleStorageFile';
export const requestConfiguration = 'data-import/splitStatus';
export const getDownloadLinkURL = (id) => `data-import/jobExecutions/${id}/downloadUrl`;
export const cancelMultipartJobEndpoint = (id) => `data-import/jobExecutions/${id}/cancel`;
const CHUNK_SIZE = 31457280; // 30 MB;

export const cancelMultipartJob = async (id, headers) => {
  const response = await fetch(cancelMultipartJobEndpoint(id), {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw response;
  }

  return response;
};

export function getStorageConfiguration(ky) {
  return ky.get(requestConfiguration).json();
}

export function getObjectStorageDownloadURL(ky, id) {
  return ky.get(getDownloadLinkURL(id)).json();
}

function initiateMultipartUpload(filename, ky) {
  return ky.get(initMPUploadEndpoint, { searchParams: { filename } }).json();
}

function getPartPresignedURL(partNumber, uploadId, key, ky) {
  return ky.get(requestPartUploadURL, { searchParams: { partNumber, key, uploadId } }).json();
}

export const getUpdateUploadDefinitionForObjectStorage = (uploadDefinition, fileKey, name) => {
  const contextFileDefIndex = uploadDefinition.fileDefinitions.findIndex(fileDef => fileDef.uiKey === fileKey);
  if (contextFileDefIndex !== -1) {
    const updatedUploadDefinition = { ...uploadDefinition };
    updatedUploadDefinition.fileDefinitions[contextFileDefIndex] = {
      ...updatedUploadDefinition.fileDefinitions[contextFileDefIndex],
      name
    };
    return updatedUploadDefinition;
  }
  return uploadDefinition;
};

function finishUpload(eTags, key, uploadId, ky) {
  return ky.post(
    finishMPUploadEndpoint,
    { json: { uploadId,
      key,
      tags: eTags } }
  ).json();
}

function uploadPart(part, url, partNumber, totalParts, fileKey, progressHandler, progressAccumulator) {
  return new Promise((resolve, reject) => {
    const partUploaderXhr = new XMLHttpRequest();
    partUploaderXhr.open('PUT', url, true);
    partUploaderXhr.upload.onprogress = event => {
      const { loaded, total } = event;
      const newEvent = {
        ...event,
        loaded: progressAccumulator.totalProgress + event.loaded,
        total: progressAccumulator.size
      };
      progressHandler(fileKey, newEvent);
      if (loaded === total) {
        progressAccumulator.updateProgress(loaded);
      }
    };
    partUploaderXhr.onreadystatechange = () => {
      const {
        status,
        responseText,
      } = partUploaderXhr;

      try {
        if (status === 200) {
          const eTag = partUploaderXhr.getResponseHeader('ETag');
          resolve(eTag);
          return;
        } else {
          const parsedResponse = JSON.parse(responseText);
          reject(parsedResponse);
        }
      } catch (error) {
        reject(error);
      }
    };
    partUploaderXhr.send(part);
  });
}

class ProgressAccumulator {
  constructor(size) {
    this.size = size;
  }

  totalProgress = 0;
  updateProgress = (value) => { this.totalProgress += value; }
}

async function sliceAndUploadParts(file, ky, fileKey, errorHandler, progressHandler, successHandler) {
  let currentByte = 0;
  let currentPartNumber = 1;
  let _uploadKey;
  let _uploadId;
  let _uploadURL;
  const progressAccumulator = new ProgressAccumulator(file.size);
  const eTags = [];
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  while (currentByte < file.size) {
    const adjustedEnd = Math.min(file.size, currentByte + CHUNK_SIZE);
    const chunk = file.file.slice(currentByte, adjustedEnd);
    try {
      if (currentByte === 0) {
        const { url, uploadId, key } = await initiateMultipartUpload(file.name, ky);
        _uploadId = uploadId;
        _uploadKey = key;
        _uploadURL = url;
      } else {
        const { url, key } = await getPartPresignedURL(currentPartNumber, _uploadId, _uploadKey, ky);
        _uploadKey = key;
        _uploadURL = url;
      }

      const eTag = await uploadPart(chunk, _uploadURL, currentPartNumber, totalParts, fileKey, progressHandler, progressAccumulator);
      eTags.push(eTag);
      currentPartNumber += 1;
      currentByte += CHUNK_SIZE;
    } catch (error) {
      errorHandler(fileKey);
      break;
    }
  }
  await finishUpload(eTags, _uploadKey, _uploadId, ky);
  // TODO - expect date string from backend when finishing the upload - creating the date stamp expected by the UI here for now...
  const finishResponse = { fileDefinitions:[{ uiKey: fileKey, uploadedDate: new Date().toLocaleDateString(), name: _uploadKey }] };
  successHandler(finishResponse, fileKey, true);
}

export function handleMultipartUpload(file, ky, fileKey, errorHandler, progressHandler, successHandler) {
  sliceAndUploadParts(file, ky, fileKey, errorHandler, progressHandler, successHandler);
}

export const handleObjectStorageUpload = (files, ky, errorHandler, progressHandler, successHandler) => {
  const fileKeys = Object.keys(files);
  Object.keys(files).forEach((fileKey, index) => handleMultipartUpload(files[fileKey], ky, fileKeys[index], errorHandler, progressHandler, successHandler));
};
