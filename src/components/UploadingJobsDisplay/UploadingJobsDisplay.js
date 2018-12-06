import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

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
    files: PropTypes.arrayOf(PropTypes.object),
    timeForDelete: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      url: host,
    } = props.stripes.okapi;

    this.state = {
      files: this.mapFilesFromProps(),
    };

    this.fileDefinitionUrl = `${host}/data-import/upload/definition`;
    this.fileUploaderUrl = `${host}/data-import/upload/file`;
    this.deleteFileUrl = (fileId, UDId) => `${host}/data-import/upload/definition/file/${fileId}?uploadDefinitionId=${UDId}`;

    this._deleteTimeouts = {};
  }

  componentDidMount() {
    this.uploadJobs();
  }

  async uploadJobs() {
    const { files } = this.state;

    const { fileDefinitions } = await createFileDefinition(
      files,
      this.fileDefinitionUrl,
      this.createJobFilesDefinitionHeaders()
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
    this.updateFileState(
      file,
      {
        fileStatus: 'uploaded',
        uploadDate: new Date(),
      }
    );
  };

  onFileUploadFail = ({ file }) => {
    this.updateFileState(file, { fileStatus: 'failed' });
  };

  onDeleteHadnler = key => {
    const { timeForDelete } = this.props;
    const file = { ...this.state.files[key] };

    this._deleteTimeouts[key] = setTimeout(() => {
      this.deleteFileFromServer(file)
        .then(checkDeleteResponse)
        .then(() => this.deleteFileFromState(key))
        .catch(error => console.error(error));
    }, timeForDelete);

    this.updateFileState(file, { fileStatus: 'forDelete' });
  }

  deleteFileFromState = key => {
    const {
      files,
    } = this.state;
    const updatedFiles = Object.assign({}, files);

    delete updatedFiles[key];

    this.setState({ files: updatedFiles });
  }

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
          fileStatus,
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
            fileStatus={fileStatus}
            uploadDate={uploadDate}
            onDelete={this.onDeleteHadnler}
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
