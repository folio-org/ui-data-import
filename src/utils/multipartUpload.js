export const initMPUploadEndpoint = 'data-import/uploadUrl';
export const requestPartUploadURL = 'data-import/uploadUrl/subsequent';
export const finishMPUploadEndpoint = 'data-import/assembleStorageFile';
export const requestConfiguration = 'data-import/splitStatus';
const CHUNK_SIZE = 31457280; // 30 MB;

export function getStorageConfiguration(ky) {
  return ky.get(requestConfiguration).json();
}

function initiateMultipartUpload(filename, ky) {
  return ky.get(initMPUploadEndpoint, { searchParams: { filename } }).json();
}

function getPartPresignedURL(partNumber, uploadId, key, ky) {
  return ky.get(requestPartUploadURL, { searchParams: { partNumber, key, uploadId } }).json();
}

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
      // console.log(`${partNumber} of ${totalParts} upload progress: ${(loaded / total) * 100}%`);
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

async function sliceAndUploadParts(file, ky, fileKey, errorHandler, progressHandler, successHandler, updateKeys) {
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
  // const finishResponse = await finishUpload(eTags, _uploadKey, _uploadId, ky);
  await finishUpload(eTags, _uploadKey, _uploadId, ky);
  // creating the date stamp expected by the UI here for now...
  const finishResponse = { fileDefinitions:[{ uiKey: fileKey, uploadedDate: new Date().toLocaleDateString() }] };
  updateKeys((keys) => [...keys, _uploadKey]);
  successHandler(finishResponse, fileKey);
}

export function handleMultipartUpload(file, ky, fileKey, errorHandler, progressHandler, successHandler, updateKeys) {
  sliceAndUploadParts(file, ky, fileKey, errorHandler, progressHandler, successHandler, updateKeys);
}

export const handleObjectStorageUpload = (files, ky, errorHandler, progressHandler, successHandler, updateKeys) => {
  const fileKeys = Object.keys(files);
  Object.keys(files).forEach((fileKey, index) => handleMultipartUpload(files[fileKey], ky, fileKeys[index], errorHandler, progressHandler, successHandler, updateKeys));
};
