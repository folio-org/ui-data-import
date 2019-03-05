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
