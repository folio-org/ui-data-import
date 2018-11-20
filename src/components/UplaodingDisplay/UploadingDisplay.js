import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStripes } from '@folio/stripes/core';

import FileItem from './components/FileItem';


class UploadingDisplay extends Component {
  static propTypes = {
    stripes: PropTypes.object,
    endpointFileDef: PropTypes.string,
    endpointFileUpload: PropTypes.string,
  }

  static defaultProps = {
    endpointFileDef: '/data-import/upload/definition',
    endpointFileUpload: '/data-import/upload/file',
  }

  state = this.mapFilesFromProps(this.props, this.mapFilesFromPropsReducer);

  async componentDidMount() {
    const {
      stripes: { okapi: { url: host } },
      endpointFileDef,
      endpointFileUpload,
    } = this.props;
    const obj = this.prepareFilesDefinition(this.state);
    const fullUrl = host + endpointFileDef;
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Okapi-Tenant': 'diku',
        'X-Okapi-Token': this.props.stripes.okapi.token,
      },
      body: JSON.stringify(obj),
    };

    const { fileDefinitions } = await this.getUploadDefinition(fullUrl, config);
    const prepearedFiles = this.prepareFilesToUpload(this.state, fileDefinitions);

    this.setState(prepearedFiles, () => {
      this.postFiles(this.state, host, endpointFileUpload, this.postFile);
    });
  }

  mapFilesFromProps(props, reducer, initReducerValue = {}) {
    if (!props.initState) return {};

    return props.initState.reduce(reducer, initReducerValue);
  }

  mapFilesFromPropsReducer(result, currentFile) {
    const keyNameValue = currentFile.name + currentFile.lastModified;

    currentFile.keyName = keyNameValue;
    currentFile.currentUploaded = 0;
    result[keyNameValue] = currentFile;

    return result;
  }

  getUploadDefinition(fullUrl, config) {
    return fetch(fullUrl, config)
      .then(res => res.json());
  }

  postFiles(filesObj, host, endpointFileUpload, postFileMethod) {
    const filesArr = Object.values(filesObj);
    const initFileIndex = 0;

    postFileMethod(initFileIndex, filesArr, host, endpointFileUpload);
  }

  postFile = async (fileIndex, filesArray, host, endpointFileUpload) => {
    const file = filesArray[fileIndex];
    const params = {
      fileId: file.id,
      uploadDefinitionId: file.uploadDefinitionId,
    };

    const url = host + endpointFileUpload + '?' + this.generateParamsString(params);
    const xhr = new XMLHttpRequest();

    try {
      const octetStream = await this.fileToOctetStream(file);

      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('X-Okapi-Tenant', 'diku');
      xhr.setRequestHeader('X-Okapi-Token', this.props.stripes.okapi.token);
      xhr.upload.onerror = error => {
        if (++fileIndex < filesArray.length) {
          this.postFile(fileIndex, filesArray, host, endpointFileUpload);
        }
      }
      xhr.upload.onprogress = event => {
        this.setState(state => {
          const updatedFile = Object.assign(state[file.keyName], { currentUploaded: event.loaded });

          return { [file.keyName]: updatedFile };
        });
      };
      xhr.upload.onload = () => {
        if (++fileIndex < filesArray.length) {
          this.postFile(fileIndex, filesArray, host, endpointFileUpload);
        }
      };
      xhr.send(octetStream);
    } catch (error) {
      console.error(error);
    }
  }

  generateParamsString(params) {
    const paramKeys = Object.keys(params);

    return paramKeys.reduce((result, currentKey, i, arr) => {
      const queryString = `${currentKey}=${params[currentKey]}`;

      result += (i < arr.length - 1) ? `${queryString}&` :
        `${queryString}`;

      return result;
    }, '');
  }

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

  prepareFilesDefinition(filesToUploadObj) {
    return Object.keys(filesToUploadObj).reduce((result, currentKey) => {
      if (!result.fileDefinitions) result.fileDefinitions = [];
      result.fileDefinitions.push({ name: currentKey });

      return result;
    }, {});
  }

  prepareFilesToUpload(filesObj, fileDefinitions) {
    const prepearedFiles = Object.assign({}, filesObj);

    fileDefinitions.forEach(item => {
      const { name, id, uploadDefinitionId } = item;

      prepearedFiles[name].id = id;
      prepearedFiles[name].uploadDefinitionId = uploadDefinitionId;
    });

    return prepearedFiles;
  }

  renderFiles(filesObj) {
    if (!filesObj) return false;

    return Object.keys(filesObj).map(key => {
      const {
        name,
        size,
        currentUploaded,
        isUploaded,
      } = filesObj[key];

      return (
        <FileItem
          key={key}
          name={name}
          size={size}
          currentUploaded={currentUploaded}
          isUploaded={isUploaded}
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
