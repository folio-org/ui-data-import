import { forEach } from 'lodash';

const xhrAddHeaders = (xhr, headers) => { // eslint-disable-line import/prefer-default-export
  forEach(headers, (value, key) => {
    xhr.setRequestHeader(key, value);
  });
};

export default xhrAddHeaders;
