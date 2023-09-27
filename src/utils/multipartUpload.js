export const initMPUploadEndpoint = 'data-import/uploadUrl';
export const requestPartUploadURL = 'data-import/uploadUrl/subsequent';
export const getFinishUploadEndpoint = (uploadDefinitionId, fileId) => `data-import/uploadDefinitions/${uploadDefinitionId}/files/${fileId}/assembleStorageFile`;
export const requestConfiguration = 'data-import/splitStatus';
export const getDownloadLinkURL = (id) => `data-import/jobExecutions/${id}/downloadUrl`;
export const cancelMultipartJobEndpoint = (id) => `data-import/jobExecutions/${id}/cancel`;
const CHUNK_SIZE = 31457280; // 30 MB;

export const cancelMultipartJob = async (ky, id) => {
  const response = await ky.delete(cancelMultipartJobEndpoint(id)).json();
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
  constructor(uploadDefinitionId, files, ky, errorHandler, progressHandler, successHandler, intl) {
    this.files = files;
    this.ky = ky;
    this.errorHandler = errorHandler;
    this.progressHandler = progressHandler;
    this.successHandler = successHandler;
    this.xhr = this.createDefaultKeyedObject(this.files, null);
    this.uploadDefinitionId = uploadDefinitionId;
    this.abortSignal = this.createDefaultKeyedObject(this.files, false);
    this.totalFileSize = this.createDefaultKeyedObject(this.files, 0);
    this.totalUploadProgress = this.createDefaultKeyedObject(this.files, 0);
    this.intl = intl;
  }

  createDefaultKeyedObject = (obj, defaultValue) => {
    const res = {};
    Object.keys(obj).forEach((k) => { res[k] = defaultValue; });
    return res;
  }

  updateProgress = (key, value) => { this.totalUploadProgress[key] += value; }

  abort = (key) => {
    if (key) {
      this.xhr[key]?.abort();
      this.abortSignal[key] = true;
    } else {
      Object.keys(this.xhr).forEach(k => {
        this.xhr[k]?.abort();
        this.abortSignal[k] = true;
      });
    }
  }

  handleProgress = (fileKey, event) => {
    const { loaded, total } = event;
    const newEvent = {
      ...event,
      loaded: this.totalUploadProgress[fileKey] + event.loaded,
      total: this.totalFileSize[fileKey]
    };
    this.progressHandler(fileKey, newEvent);
    if (loaded === total) {
      this.updateProgress(fileKey, loaded);
    }
  }

  uploadPart = (part, url, fileKey) => {
    return new Promise((resolve, reject) => {
      this.xhr[fileKey] = new XMLHttpRequest();
      const currentXhr = this.xhr[fileKey];
      currentXhr.open('PUT', url, true);
      currentXhr.upload.addEventListener('progress', (e) => this.handleProgress(fileKey, e));
      currentXhr.upload.addEventListener('abort', () => {
        this.abortSignal[fileKey] = true;
      });
      currentXhr.addEventListener('readystatechange', () => {
        const {
          status,
          responseText,
        } = this.xhr[fileKey];

        try {
          if (status === 200) {
            const eTag = this.xhr[fileKey].getResponseHeader('ETag');
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
      currentXhr.addEventListener('error', () => {
        this.abortSignal[fileKey] = true;
        this.errorHandler(fileKey, new Error(this.intl.formatMessage({ id: 'ui-data-import.upload.invalid' })));
      });
      currentXhr.send(part);
    });
  };

  sliceAndUploadParts = async (file, fileKey) => {
    let currentByte = 0;
    let currentPartNumber = 1;
    let _uploadKey;
    let _uploadId;
    let _uploadURL;
    this.totalFileSize = file.size;
    const eTags = [];
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);
    while (currentByte < file.size && !this.abortSignal[fileKey]) {
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

        const eTag = await this.uploadPart(chunk, _uploadURL, fileKey, currentPartNumber, totalParts);
        eTags.push(eTag);
        currentPartNumber += 1;
        currentByte += CHUNK_SIZE;
      } catch (error) {
        if (error.message !== 'userCancelled') this.errorHandler(fileKey, error);
        this.abortSignal[fileKey] = true;
        break;
      }
    }
    if (this.abortSignal[fileKey]) return;
    await finishUpload(eTags, _uploadKey, _uploadId, this.uploadDefinitionId, file.id, this.ky);
    const finishResponse = { fileDefinitions:[{ uiKey: fileKey, uploadedDate: new Date().toLocaleDateString(), name: _uploadKey }] };
    this.successHandler(finishResponse, fileKey, true);
  };

  init = () => {
    for (const fileKey in this.files) {
      if (Object.hasOwn(this.files, fileKey)) {
        this.sliceAndUploadParts(this.files[fileKey], fileKey);
      }
    }
  };
}
