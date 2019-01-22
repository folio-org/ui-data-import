import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';
import {
  Layout,
  Callout,
} from '@folio/stripes/components';

import * as fileStatuses from './components/FileItem/fileItemStatuses';
import EndOfList from '../EndOfList';
import FileItem from './components/FileItem';
import createUrl from '../../utils/createUrl';
import { DEFAULT_TIMEOUT_BEFORE_FILE_DELETION } from '../../utils/constants';
import * as API from './utils/upload';

class UploadingJobsDisplay extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    filesData: PropTypes.arrayOf(PropTypes.object),
    timeoutBeforeFileDeletion: PropTypes.number, // milliseconds
  };

  static defaultProps = {
    filesData: [],
    timeoutBeforeFileDeletion: DEFAULT_TIMEOUT_BEFORE_FILE_DELETION,
  };

  static knownErrorsIDs = ['upload.fileSize.invalid'];

  static getUploadFilesErrorMessageID(msg) {
    const defaultErrorId = 'upload.invalid';

    return UploadingJobsDisplay.knownErrorsIDs.includes(msg) ? msg : defaultErrorId;
  }

  constructor(props) {
    super(props);

    const {
      filesData,
      stripes: { okapi },
    } = props;

    const { url: host } = okapi;

    this.state = {
      files: this.prepareFiles(filesData),
    };

    this.fileDefinitionUrl = createUrl(`${host}/data-import/upload/definition`);
    this.fileUploaderUrl = createUrl(`${host}/data-import/upload/file`);
    this.deleteFileUrl = file => createUrl(`${host}/data-import/upload/definition/file/${file.id}`, {
      uploadDefinitionId: file.uploadDefinitionId,
    });
    this.deleteFileTimeouts = {};

    this.fileRemovalMap = {
      [fileStatuses.UPLOADED]: this.handleDeleteSuccessfullyUploadedFile,
      [fileStatuses.FAILED]: this.deleteFileAPI,
      [fileStatuses.FAILED_DEFINITION]: this.deleteFileFromState,
    };
  }

  componentDidMount() {
    this.uploadJobs();
    this.setPageLeaveHandler();
  }

  componentWillUnmount() {
    this.cancelFileRemovals();
    this.resetPageLeaveHandler();
  }

  setPageLeaveHandler() {
    // prevent from leaving the page in case of download in progress
    window.onbeforeunload = () => {
      const { files } = this.state;
      const notAbleToLeave = Object.keys(files).some(key => {
        return files[key].status === fileStatuses.UPLOADING;
      });

      return notAbleToLeave ? true : undefined;
    };
  }

  resetPageLeaveHandler() {
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
    // post file upload definition with all files metadata as
    // individual file upload should have upload definition id in the URL
    const [errMsg, response] = await API.createFileDefinition(
      this.state.files,
      this.fileDefinitionUrl,
      this.createFilesDefinitionHeaders(),
    );

    if (errMsg) {
      this.onAllFilesUploadFail(errMsg);

      return;
    }

    this.setState(state => {
      return { files: API.updateFilesWithFileDefinitionMetadata(state.files, response.fileDefinitions) };
    }, () => {
      API.uploadFiles(
        this.props.filesData,
        this.state.files,
        this.fileUploaderUrl,
        this.createUploadFilesHeaders(),
        this.onFileUploadProgress,
        this.onFileUploadSuccess,
        this.onFileUploadFail,
      );
    });
  }

  createFilesDefinitionHeaders() {
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

  createUploadFilesHeaders() {
    const {
      token,
      tenant,
    } = this.props.stripes.okapi;

    return {
      'Content-Type': 'application/octet-stream',
      'Transfer-Encoding': 'chunked',
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

  prepareFiles(filesData) {
    return filesData.reduce((res, file) => {
      // `uiKey` is needed in order to match the individual file on UI with
      // the response from the backend since it returns the all files state
      const uiKey = `${file.name}${file.lastModified}`;
      // if file is already uploaded it has already the `uiKey` and if not it should be assigned
      const key = file.uiKey || uiKey;

      const preparedFile = {
        id: file.id,
        uploadDefinitionId: file.uploadDefinitionId,
        key,
        name: file.name,
        size: file.size,
        loading: false,
        uploadedDate: file.uploadedDate,
        status: fileStatuses.UPLOADING,
        currentUploaded: 0,
      };

      return {
        ...res,
        [key]: preparedFile,
      };
    }, {});
  }

  updateFileState(key, data) {
    this.setState(state => {
      const updatedFile = {
        ...state.files[key],
        ...data,
      };

      return {
        files: {
          ...state.files,
          [key]: updatedFile,
        },
      };
    });
  }

  onFileUploadProgress = (key, { loaded: uploadedValue }) => {
    this.updateFileState(key, { uploadedValue });
  };

  onFileUploadSuccess = (resp, key) => {
    const updatedFile = resp.fileDefinitions.find(file => file.uiKey === key);

    this.updateFileState(key, {
      status: fileStatuses.UPLOADED,
      uploadDate: updatedFile.uploadedDate,
    });
  };

  onFileUploadFail = (resp, key) => {
    this.updateFileState(key, { status: fileStatuses.FAILED });
  };

  handleUndoDeleteFile = key => {
    const file = this.state.files[key];

    clearTimeout(this.deleteFileTimeouts[key]);

    this.updateFileState(file.key, { status: fileStatuses.UPLOADED });
  };

  handleDeleteFile = (key, status) => {
    const deleteFile = this.fileRemovalMap[status];

    if (deleteFile) {
      deleteFile(key, status);
    }
  };

  deleteFileAPI = (key, status) => {
    const file = this.state.files[key];

    this.updateFileState(file.key, { loading: true });

    API.deleteFile(
      this.deleteFileUrl(file),
      this.createDeleteFileHeaders(),
    )
      .then(() => this.deleteFileFromState(key))
      .catch(error => {
        this.updateFileState(file.key, {
          status,
          loading: false,
        });

        const errorMessage = (
          <FormattedMessage
            id="ui-data-import.fileDeleteError"
            values={{ name: <strong>{file.name}</strong> }}
          />
        );

        this.callout.sendCallout({
          type: 'error',
          message: errorMessage,
        });
        console.error(error); // eslint-disable-line no-console
      });
  };

  handleDeleteSuccessfullyUploadedFile = (key, status) => {
    const { timeoutBeforeFileDeletion } = this.props;

    this.deleteFileTimeouts[key] = setTimeout(() => {
      this.deleteFileAPI(key, status);
    }, timeoutBeforeFileDeletion);

    this.updateFileState(key, { status: fileStatuses.DELETING });
  };

  deleteFileFromState = key => {
    this.setState(state => {
      const {
        [key]: fileToDelete, // eslint-disable-line no-unused-vars
        ...updatedFiles
      } = state.files;

      return { files: updatedFiles };
    });
  };

  onAllFilesUploadFail(errMsg) {
    const errorMsgTranslationID = UploadingJobsDisplay.getUploadFilesErrorMessageID(errMsg);

    this.setState(state => {
      const files = Object.keys(state.files)
        .reduce((res, key) => {
          const updatedFile = {
            ...state.files[key],
            status: fileStatuses.FAILED_DEFINITION,
            errorMsgTranslationID,
          };

          return {
            ...res,
            [key]: updatedFile,
          };
        }, {});

      return { files };
    });
  }

  renderFiles() {
    const { files } = this.state;
    const hasFiles = Object.keys(files).length > 0;

    if (!hasFiles) {
      return (
        <Layout className="textCentered">
          <FormattedMessage id="ui-data-import.noUploadedFiles" />
        </Layout>
      );
    }

    return Object.keys(files)
      .map(fileKey => {
        const {
          key,
          status,
          name,
          size,
          uploadedValue,
          uploadDate,
          errorMsgTranslationID,
          loading,
        } = files[fileKey];

        return (
          <FileItem
            key={key}
            uiKey={key}
            status={status}
            name={name}
            size={size}
            loading={loading}
            uploadedValue={uploadedValue}
            uploadDate={uploadDate}
            errorMsgTranslationID={errorMsgTranslationID}
            onDelete={this.handleDeleteFile}
            onUndoDelete={this.handleUndoDeleteFile}
          />
        );
      });
  }

  createCalloutRef = ref => {
    this.callout = ref;
  };

  render() {
    return (
      <div>
        {this.renderFiles()}
        <EndOfList />
        <Callout ref={this.createCalloutRef} />
      </div>
    );
  }
}

export default withStripes(UploadingJobsDisplay);
