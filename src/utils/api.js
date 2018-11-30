export const addHeaders = (xhr, headers) => { // eslint-disable-line import/prefer-default-export
  const headerKeys = Object.keys(headers);

  headerKeys.forEach(headerKey => {
    xhr.setRequestHeader(headerKey, headers[headerKey]);
  });

  return xhr;
};
