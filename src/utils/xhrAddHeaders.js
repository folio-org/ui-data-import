import { forEach } from 'lodash';

export const xhrAddHeaders = (xhr, headers) => {
  forEach(headers, (value, key) => {
    xhr.setRequestHeader(key, value);
  });
};
