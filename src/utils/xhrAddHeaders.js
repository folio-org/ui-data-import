const xhrAddHeaders = (xhr, headers) => { // eslint-disable-line import/prefer-default-export
  Object.keys(headers)
    .forEach(headerKey => {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    });
};

export default xhrAddHeaders;
