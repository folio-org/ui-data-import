import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';

import * as fileStatuses from './components/FileItem/fileItemStatuses';
import EndOfList from '../EndOfList';
import FileItem from './components/FileItem';
import createUrl from '../../utils/createUrl';
import { DEFAULT_TIMEOUT_BEFORE_FILE_DELETION } from '../../utils/constants';
import * as API from './utils/upload';

class UploadingJobsDisplay extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    files: PropTypes.arrayOf(PropTypes.object),
    timeoutBeforeFileDeletion: PropTypes.number, // milliseconds
  };

  static defaultProps = {
    files: [],
    timeoutBeforeFileDeletion: DEFAULT_TIMEOUT_BEFORE_FILE_DELETION,
  };

  constructor(props) {
    super(props);

    const { url: host } = props.stripes.okapi;

    this.state = {
      files: this.mapFilesFromProps(),
    };

    this.fileDefinitionUrl = createUrl(`${host}/data-import/upload/definition`);
    this.fileUploaderUrl = createUrl(`${host}/data-import/upload/file`);
    this.deleteFileUrl = file => createUrl(`${host}/data-import/upload/definition/file/${file.id}`, {
      uploadDefinitionId: file.uploadDefinitionId,
    });
    this.deleteFileTimeouts = {};
  }

  componentDidMount() {
    this.uploadJobs();
  }

  componentDidUpdate() {
    if (!this.props.files) {
      return;
    }
    this.onLeaveHandler();
  }

  componentWillUnmount() {
    this.cancelFileRemovals();
    this.resetLeaveThePagePrevention();
  }

  onLeaveHandler() {
    const notAbleToLeave = Object.keys(this.props.files).some((file) => {
      return this.props.files[file].status.toLowerCase() === 'uploading';
    });

    // prevent from leaving the page in case of download in progress
    if (notAbleToLeave) {
      window.onbeforeunload = () => {
        return false;
      };
    } else {
      this.resetLeaveThePagePrevention();
    }
  }

  resetLeaveThePagePrevention() {
    window.onbeforeunload = null;
  }

  cancelFileRemovals() {
    Object
      .keys(this.deleteFileTimeouts)
      .forEach(timeoutId => {
        clearTimeout(this.deleteFileTimeouts[timeoutId]);
      });

    this.deleteFileTimeouts = {};
  }

  async uploadJobs() {
    const { files } = this.state;

    try {
      const { fileDefinitions } = await API.createFileDefinition(
        files,
        this.fileDefinitionUrl,
        this.createJobFilesDefinitionHeaders(),
      );

      const preparedFiles = API.prepareFilesToUpload(files, fileDefinitions);

      this.setState({ files: preparedFiles }, () => {
        API.uploadFiles(
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
      currentFile.status = fileStatuses.UPLOADING;
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
      status: fileStatuses.UPLOADED,
      uploadDate: new Date(), // TODO replace with field from backend (MODDATAIMP-54)
    });
  };

  onFileUploadFail = ({ file }) => {
    this.updateFileState(file, { status: fileStatuses.FAILED });
  };

  handleUndoDeleteFile = key => {
    const file = this.state.files[key];

    clearTimeout(this.deleteFileTimeouts[key]);

    this.updateFileState(file, { status: fileStatuses.UPLOADED });
  };

  handleDeleteFile = key => {
    const { timeoutBeforeFileDeletion } = this.props;
    const file = this.state.files[key];

    this.deleteFileTimeouts[key] = setTimeout(() => {
      API.deleteFile(
        this.deleteFileUrl(file),
        this.createDeleteFileHeaders(),
      )
        .then(() => this.deleteFileFromState(key))
        .catch(error => {
          this.updateFileState(file, { status: fileStatuses.UPLOADED });
          console.error(error); // eslint-disable-line no-console
        });
    }, timeoutBeforeFileDeletion);

    this.updateFileState(file, { status: fileStatuses.DELETING });
  };

  deleteFileFromState = key => {
    const { files } = this.state;
    const updatedFiles = { ...files };

    delete updatedFiles[key];

    this.setState({ files: updatedFiles });
  };

  onAllFilesUploadFail() {
    this.setState(state => {
      const files = Object.keys(state.files).reduce((res, key) => {
        const file = state.files[key];

        file.status = fileStatuses.FAILED;

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

    if (!Object.keys(files).length) {
      return (
        <Layout className="textCentered">
          <FormattedMessage id="ui-data-import.noUploadedFiles" />
        </Layout>
      );
    }

    return Object.keys(files)
      .map(key => {
        const {
          name,
          size,
          uploadedValue,
          status,
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
            status={status}
            uploadDate={uploadDate}
            onDelete={this.handleDeleteFile}
            onUndoDelete={this.handleUndoDeleteFile}
          />
        );
      });
  }

  render() {
    return (
      <div>
        {this.renderFiles()}
        <EndOfList />
      </div>
    );
  }
}

export default withStripes(UploadingJobsDisplay);
