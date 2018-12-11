import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import {
  UPLOADED,
  UPLOADING,
  FAILED,
} from './components/FileItem/fileItemStatuses';
import FileItem from './components/FileItem';
import {
  createFileDefinition, // eslint-disable-line
  prepareFilesToUpload, // eslint-disable-line
  uploadFiles,
  checkDeleteResponse,
} from './utils/upload';

class UploadingJobsDisplay extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    timeForDelete: PropTypes.number.isRequired,
    files: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);

    const { url: host } = props.stripes.okapi;

    this.state = {
      files: this.mapFilesFromProps(),
    };

    this.fileDefinitionUrl = `${host}/data-import/upload/definition`;
    this.fileUploaderUrl = `${host}/data-import/upload/file`;
    this.deleteFileUrl = (fileId, UDId) => `${host}/data-import/upload/definition/file/${fileId}?uploadDefinitionId=${UDId}`;
    this.deleteTimeouts = {};
  }

  componentDidMount() {
    this.uploadJobs();
  }

  componentWillUnmount() {
    this.cancelFileRemovals();
  }

  cancelFileRemovals() {
    Object
      .keys(this.deleteTimeouts)
      .forEach((timeoutId) => {
        clearTimeout(this.deleteTimeouts[timeoutId]);
      });

    this.deleteTimeouts = {};
  }

  async uploadJobs() {
    const { files } = this.state;

    try {
      const { fileDefinitions } = await createFileDefinition(
        files,
        this.fileDefinitionUrl,
        this.createJobFilesDefinitionHeaders(),
      );

      const preparedFiles = prepareFilesToUpload(files, fileDefinitions);

      this.setState({ files: preparedFiles }, () => {
        uploadFiles(
          this.state.files,
          this.fileUploaderUrl,
          this.createUploadJobFilesHeaders(),
          this.onFileUploadProgress,
          this.onFileUploadSuccess,
          this.onFileUploadFail,
        );
      });
    } catch (e) {
      this.onAllFilesUploadFail();
    }
  }

  createJobFilesDefinitionHeaders() {
    const {
      token,
      tenant,
    } = this.props.stripes.okapi;

    return {
      'Content-Type': 'application/json',
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };
  }

  createUploadJobFilesHeaders() {
    const {
      token,
      tenant,
    } = this.props.stripes.okapi;

    return {
      'Content-Type': 'application/octet-stream',
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };
  }

  createDeleteFileHeaders() {
    const {
      token,
      tenant,
    } = this.props.stripes.okapi;

    return {
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };
  }

  mapFilesFromProps() {
    return this.props.files.reduce((result, currentFile) => {
      const keyNameValue = currentFile.name + currentFile.lastModified;

      currentFile.keyName = keyNameValue;
      currentFile.uploadStatus = UPLOADING;
      currentFile.currentUploaded = 0;
      result[keyNameValue] = currentFile;

      return result;
    }, {});
  }

  updateFileState(file, data) {
    this.setState(state => {
      const updatedFile = Object.assign(state.files[file.keyName], data);

      return {
        files: {
          ...state.files,
          [file.keyName]: updatedFile,
        },
      };
    });
  }

  onFileUploadProgress = (file, event) => {
    this.updateFileState(file, { uploadedValue: event.loaded });
  };

  onFileUploadSuccess = ({ file }) => {
    this.updateFileState(file, {
      uploadStatus: UPLOADED,
      uploadDate: new Date(),
    });
  };

  onFileUploadFail = ({ file }) => {
    this.updateFileState(file, { uploadStatus: FAILED });
  };

  onDeleteHandler = key => {
    const { timeForDelete } = this.props;
    const file = { ...this.state.files[key] };

    this.deleteTimeouts[key] = setTimeout(() => {
      this.deleteFileFromServer(file)
        .then(checkDeleteResponse)
        .then(() => this.deleteFileFromState(key))
        .catch(error => {
          this.updateFileState(file, { fileStatus: UPLOADED });
          console.error(error); // eslint-disable-line no-console
        });
    }, timeForDelete);

    this.updateFileState(file, { fileStatus: 'forDelete' });
  };

  deleteFileFromState = key => {
    const { files } = this.state;
    const updatedFiles = Object.assign({}, files);

    delete updatedFiles[key];

    this.setState({ files: updatedFiles });
  };

  deleteFileFromServer(file) {
    const config = {
      method: 'DELETE',
      headers: this.createDeleteFileHeaders(),
    };

    return fetch(
      this.deleteFileUrl(file.id, file.uploadDefinitionId),
      config
    );
  }

  onAllFilesUploadFail() {
    this.setState(state => {
      const files = Object.keys(state.files).reduce((res, key) => {
        const file = state.files[key];

        file.uploadStatus = FAILED;

        return {
          ...res,
          [key]: file,
        };
      }, {});

      return { files };
    });
  }

  renderFiles() {
    const { files } = this.state;

    if (!files) {
      return null;
    }

    return Object.keys(files)
      .map(key => {
        const {
          name,
          size,
          uploadedValue,
          uploadStatus,
          uploadDate,
          keyName,
        } = files[key];

        return (
          <FileItem
            key={keyName}
            keyName={keyName}
            name={name}
            size={size}
            uploadedValue={uploadedValue}
            uploadStatus={uploadStatus}
            uploadDate={uploadDate}
            onDelete={this.onDeleteHandler}
          />
        );
      });
  }

  render() {
    return (
      <div>
        {this.renderFiles()}
      </div>
    );
  }
}

export default withStripes(UploadingJobsDisplay);
