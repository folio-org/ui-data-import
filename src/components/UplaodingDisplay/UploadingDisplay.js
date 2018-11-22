import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import FileItem from './components/FileItem';

class UploadingDisplay extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    initState: PropTypes.arrayOf(PropTypes.object),
    endpointFileDef: PropTypes.string,
    endpointFileUpload: PropTypes.string,
  };

  static defaultProps = {
    endpointFileDef: '/data-import/upload/definition',
    endpointFileUpload: '/data-import/upload/file',
  };

  static mapFilesFromProps(props) {
    const reducer = (result, currentFile) => {
      const keyNameValue = currentFile.name + currentFile.lastModified;

      currentFile.keyName = keyNameValue;
      currentFile.currentUploaded = 0;
      result[keyNameValue] = currentFile;

      return result;
    };

    return props.initState.reduce(reducer, {});
  }

  static addHeaders = (xhr, headers) => {
    const headerKeys = Object.keys(headers);

    headerKeys.forEach(headerKey => {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    });

    return xhr;
  };

  static prepareFilesDefinition(filesToUpload) {
    const resultFiles = Object.keys(filesToUpload)
      .reduce((files, currentKey) => files.concat({ name: currentKey }), []);

    return { fileDefinitions: resultFiles };
  }

  static async getUploadDefinition(fullUrl, config) {
    return fetch(fullUrl, config)
      .then(res => res.json());
  }

  state = UploadingDisplay.mapFilesFromProps(this.props);

  async componentDidMount() {
    const {
      endpointFileDef,
      endpointFileUpload,
    } = this.props;
    const {
      url: host,
      token,
      tenant,
    } = this.props.stripes.okapi;

    const filesDefinition = UploadingDisplay.prepareFilesDefinition(this.state);
    const definitionsUrl = host + endpointFileDef;
    const definitionHeaders = {
      'Content-Type': 'application/json',
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };
    const definitionRequestConfig = {
      method: 'POST',
      headers: definitionHeaders,
      body: JSON.stringify(filesDefinition),
    };
    const { fileDefinitions } = await UploadingDisplay.getUploadDefinition(definitionsUrl, definitionRequestConfig);

    const preparedFiles = this.prepareFilesToUpload(this.state, fileDefinitions);
    const fileUploadHeaders = {
      'Content-Type': 'application/octet-stream',
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };

    this.setState(preparedFiles, () => {
      this.postFiles(
        this.state,
        host,
        endpointFileUpload,
        fileUploadHeaders,
        this.postFile,
        this.onXHRprogress,
        this.onXHRload,
        this.onXHRerror,
      );
    });
  }

  prepareFilesToUpload(files, fileDefinitions) {
    const preparedFiles = Object.assign({}, files);

    fileDefinitions.forEach(item => {
      const { name, id, uploadDefinitionId } = item;

      preparedFiles[name].id = id;
      preparedFiles[name].uploadDefinitionId = uploadDefinitionId;
    });

    return preparedFiles;
  }

  postFiles(
    files,
    host,
    endpointFileUpload,
    headers,
    postFile,
    onXHRprogress,
    onXHRload,
    onXHRerror,
  ) {
    const filesArr = Object.values(files);
    let promise = Promise.resolve();

    filesArr.forEach(file => {
      promise = promise
        .then(() => postFile(file, host, endpointFileUpload, headers, onXHRprogress))
        .then(onXHRload)
        .catch(onXHRerror);
    });
  }

  postFile = (file, host, endpoint, headers, onprogress) => {
    return new Promise(async (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      const paramString = `?fileId=${file.id}&uploadDefinitionId=${file.uploadDefinitionId}`;

      xhr.open('POST', host + endpoint + paramString);
      xhr = UploadingDisplay.addHeaders(
        xhr,
        headers,
      );

      try {
        const octet = await this.fileToOctetStream(file);

        xhr.upload.onprogress = onprogress.bind(null, file);
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) return;
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

        xhr.send(octet);
      } catch (e) {
        this.onFileReadError(e);
      }
    });
  };

  fileToOctetStream(file) {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new Error(`Problem parsing ${file.name}`));
      };

      fileReader.onloadend = () => {
        resolve(new Uint8Array(fileReader.result));
      };

      fileReader.readAsArrayBuffer(file);
    });
  }

  onXHRprogress = (file, event) => {
    this.setState(state => {
      const updatedFile = Object.assign(state[file.keyName], { currentUploaded: event.loaded });

      return { [file.keyName]: updatedFile };
    });
  };

  onXHRload = ({ file }) => {
    this.setState(state => {
      const updatedFile = Object.assign(state[file.keyName], { uploadStatus: 'success' });

      return { [file.keyName]: updatedFile };
    });
  };

  onXHRerror = ({ file }) => {
    this.setState(state => {
      const updatedFile = Object.assign(state[file.keyName], { uploadStatus: 'failed' });

      return { [file.keyName]: updatedFile };
    });
  };

  onFileReadError(error) {
    console.error(error);
  }

  renderFiles(files) {
    if (!files) return false;

    return Object.keys(files)
      .map(key => {
        const {
          name,
          size,
          currentUploaded,
          uploadStatus,
        } = files[key];

        return (
          <FileItem
            key={key}
            name={name}
            size={size}
            currentUploaded={currentUploaded}
            uploadStatus={uploadStatus}
          />
        );
      });
  }

  render() {
    return (
      <div>
        {this.renderFiles(this.state)}
      </div>
    );
  }
}

export default withStripes(UploadingDisplay);
