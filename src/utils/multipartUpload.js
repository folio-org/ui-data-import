/* eslint-disable max-classes-per-file */

export const initMPUploadEndpoint = 'data-import/uploadUrl';
export const requestPartUploadURL = 'data-import/uploadUrl/subsequent';
export const getFinishUploadEndpoint = (uploadDefinitionId, fileId) => `data-import/uploadDefinitions/${uploadDefinitionId}/files/${fileId}/assembleStorageFile`;
export const requestConfiguration = 'data-import/splitStatus';
export const getDownloadLinkURL = (id) => `data-import/jobExecutions/${id}/downloadUrl`;
export const cancelMultipartJobEndpoint = (id) => `data-import/jobExecutions/${id}/cancel`;
const CHUNK_SIZE = 31457280; // 30 MB;

export const cancelMultipartJob = async (id, headers) => {
  const response = await fetch(cancelMultipartJobEndpoint(id), {
    method: 'DELETE',
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

function finishUpload(eTags, key, uploadId, uploadDefinitionId, fileDefinitionId, ky) {
  return ky.post(
    getFinishUploadEndpoint(uploadDefinitionId, fileDefinitionId),
    { json: { uploadId,
      key,
      tags: eTags } }
  ).json();
}

export function trimLeadNumbers(name) {
  return name ? name.replace(/^\d*-/, '') : '';
}

export class MultipartUploader {
  constructor(uploadDefinitionId, files, ky, errorHandler, progressHandler, successHandler) {
    this.files = files;
    this.ky = ky;
    this.errorHandler = errorHandler;
    this.progressHandler = progressHandler;
    this.successHandler = successHandler;
    this.xhr = null;
    this.uploadDefinitionId = uploadDefinitionId;
    this.abortSignal = false;
    this.totalFileSize = 0;
    this.totalUploadProgress = 0;
  }

  updateProgress = (value) => { this.totalUploadProgress += value; }

  abort = () => {
    this.xhr?.abort();
    this.abortSignal = true;
  }

  handleProgress = (event) => {
    const { loaded, total } = event;
    const newEvent = {
      ...event,
      loaded: this.totalUploadProgress + event.loaded,
      total: this.totalFileSize
    };
    this.progressHandler(this.currentFileKey, newEvent);
    if (loaded === total) {
      this.updateProgress(loaded);
    }
  }

  uploadPart = (part, url, partNumber, totalParts, fileKey) => {
    return new Promise((resolve, reject) => {
      this.xhr = new XMLHttpRequest();
      this.xhr.open('PUT', url, true);
      this.xhr.addEventListener('progress', this.handleProgress);
      this.xhr.addEventListener('readystatechange', () => {
        const {
          status,
          responseText,
        } = this.xhr;

        try {
          if (status === 200) {
            const eTag = this.xhr.getResponseHeader('ETag');
            resolve(eTag);
            return;
          } else if (status === 0) {
            reject(new Error('userCancelled'));
            return;
          } else {
            const parsedResponse = JSON.parse(responseText);
            reject(parsedResponse);
          }
        } catch (error) {
          reject(error);
        }
      });

      this.xhr.addEventListener('abort', () => {
        this.abortSignal = true;
      });

      this.xhr.send(part);
    });
  };

  sliceAndUploadParts = async (file, fileKey) => {
    this.currentFileKey = fileKey;
    let currentByte = 0;
    let currentPartNumber = 1;
    let _uploadKey;
    let _uploadId;
    let _uploadURL;
    this.totalFileSize = file.size;
    const eTags = [];
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);
    while (currentByte < file.size && !this.abortSignal) {
      const adjustedEnd = Math.min(file.size, currentByte + CHUNK_SIZE);
      const chunk = file.file.slice(currentByte, adjustedEnd);
      try {
        if (currentByte === 0) {
          const { url, uploadId, key } = await initiateMultipartUpload(file.name, this.ky);
          _uploadId = uploadId;
          _uploadKey = key;
          _uploadURL = url;
        } else {
          const { url, key } = await getPartPresignedURL(currentPartNumber, _uploadId, _uploadKey, this.ky);
          _uploadKey = key;
          _uploadURL = url;
        }

        const eTag = await this.uploadPart(chunk, _uploadURL, currentPartNumber, totalParts, fileKey);
        eTags.push(eTag);
        currentPartNumber += 1;
        currentByte += CHUNK_SIZE;
      } catch (error) {
        if (error.message !== 'userCancelled') this.errorHandler(fileKey, error);
        break;
      }
    }
    if (this.abortSignal) return;
    await finishUpload(eTags, _uploadKey, _uploadId, this.uploadDefinitionId, file.id, this.ky);
    // TODO - expect date string from backend when finishing the upload - creating the date stamp expected by the UI here for now...
    const finishResponse = { fileDefinitions:[{ uiKey: fileKey, uploadedDate: new Date().toLocaleDateString(), name: _uploadKey }] };
    this.successHandler(finishResponse, fileKey, true);
    this.currentFileKey = null;
  };

  init = () => {
    const fileKeys = Object.keys(this.files);
    Object.keys(this.files).forEach((fileKey, index) => this.sliceAndUploadParts(this.files[fileKey], fileKeys[index]));
  };
}

/* eslint-enable */
