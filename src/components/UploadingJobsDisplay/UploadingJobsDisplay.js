import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
  isEmpty,
  map,
  omit,
  some,
  get,
} from 'lodash';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';
import {
  Pane,
  Paneset,
  PaneHeader,
  Layout,
  Callout,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  Preloader,
  EndOfItem,
  createOkapiHeaders,
  createUrl,
  getFileExtension,
} from '@folio/stripes-data-transfer-components';

import { UploadingJobsContext } from '../UploadingJobsContextProvider';
import { FileItem } from './components';
import {
  xhrAddHeaders,
  generateSettingsLabel,
  FILE_STATUSES,
} from '../../utils';
import * as API from '../../utils/upload';
import { createJobProfiles } from '../../settings/JobProfiles';

import css from './UploadingJobsDisplay.css';
import sharedCss from '../../shared.css';

@withRouter
@withStripes
export class UploadingJobsDisplay extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    history: PropTypes.shape({
      block: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.oneOfType([
      PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        state: PropTypes.shape({ files: PropTypes.object }),
      }).isRequired,
      PropTypes.string.isRequired,
    ]),
  };

  static contextType = UploadingJobsContext;

  static knownErrorsIDs = ['upload.fileSize.invalid'];

  state = {
    files: {},
    hasLoaded: false,
    renderLeaveModal: false,
    renderCancelUploadFileModal: false,
    recordsLoadingInProgress: false,
    JobProfilesComponent: null,
    actionMenuItems: ['run'],
  };

  async componentDidMount() {
    this.mounted = true;
    this.fileRemovalMap = {
      [FILE_STATUSES.DELETING]: this.deleteFileAPI,
      [FILE_STATUSES.ERROR]: this.deleteFileAPI,
      [FILE_STATUSES.ERROR_DEFINITION]: this.deleteFileFromState,
    };

    this.setPageLeaveHandler();
    this.mapFilesToState();
    await this.uploadJobs();
    this.updateJobProfilesComponent();
  }

  componentWillUnmount() {
    this.mounted = false;

    this.resetPageLeaveHandler();
  }

  calloutRef = createRef();
  selectedFile = null;

  mapFilesToState() {
    const {
      history,
      location,
    } = this.props;

    const files = get(location, ['state', 'files']);

    // in snapshot mode component renders files from upload definition if any
    // otherwise component renders files that are going to be uploaded
    this.isSnapshotMode = isEmpty(files);

    this.setState({ files });

    // clear history state to prevent incorrect determination of snapshot mode
    history.replace({
      ...location,
      state: {},
    });
  }

  // prevent from leaving the page in case if uploading is in progress
  setPageLeaveHandler() {
    const { history } = this.props;

    this.unblockNavigation = history.block(this.handleNavigation);
    window.addEventListener('beforeunload', this.handlePageLeave);
  }

  resetPageLeaveHandler() {
    this.unblockNavigation();
    window.removeEventListener('beforeunload', this.handlePageLeave);
  }

  handlePageLeave = event => {
    const shouldPrompt = this.filesUploading;

    if (shouldPrompt) {
      event.returnValue = true;

      return true;
    }

    return null;
  };

  handleNavigation = nextLocation => {
    const { location } = this.props;

    const locationHasChanged = location.pathname !== nextLocation.pathname;
    const shouldPrompt = this.filesUploading && locationHasChanged;

    if (shouldPrompt) {
      this.setState({
        renderLeaveModal: true,
        nextLocation,
      });
    }

    return !shouldPrompt;
  };

  get filesUploading() {
    const { files } = this.state;

    return !this.isSnapshotMode && some(files, file => file.status === FILE_STATUSES.UPLOADING);
  }

  renderSnapshotData() {
    const { uploadDefinition: { fileDefinitions } } = this.context;

    this.setState({ files: API.mapFilesToUI(fileDefinitions) });
  }

  async fetchUploadDefinition() {
    try {
      const { updateUploadDefinition } = this.context;

      await updateUploadDefinition();

      this.setState({ hasLoaded: true });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }

  async uploadJobs() {
    try {
      await this.fetchUploadDefinition();

      if (this.isSnapshotMode) {
        this.renderSnapshotData();

        return;
      }

      this.uploadFiles();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }

  cancelCurrentFileUpload() {
    if (this.currentFileUploadXhr) {
      this.currentFileUploadXhr.abort();
    }
  }

  async uploadFiles() {
    const { files } = this.state;

    for (const fileKey of Object.keys(files)) {
      try {
        // cancel current and next file uploads if component is unmounted
        /* istanbul ignore if  */
        if (!this.mounted) {
          this.cancelCurrentFileUpload();
          break;
        }

        // eslint-disable-next-line no-await-in-loop
        const response = await this.uploadFile(fileKey);

        this.handleFileUploadSuccess(response, fileKey);
      } catch (error) {
        this.handleFileUploadFail(fileKey);
      }
    }

    this.currentFileUploadXhr = null;
  }

  uploadFile(fileKey) {
    // @FIXME: Fix this rules violation ASAP!
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { files: { [fileKey]: fileMeta } } = this.state;

        const url = this.createFileUrl(fileMeta);

        this.currentFileUploadXhr = new XMLHttpRequest();

        this.currentFileUploadXhr.open('POST', url);

        xhrAddHeaders(this.currentFileUploadXhr, this.createUploadFilesHeaders());

        this.currentFileUploadXhr.upload.onprogress = event => {
          this.onFileUploadProgress(fileKey, event);
        };

        this.currentFileUploadXhr.onreadystatechange = () => {
          const {
            status,
            readyState,
            responseText,
          } = this.currentFileUploadXhr;

          if (readyState !== 4) {
            return;
          }

          try {
            const parsedResponse = JSON.parse(responseText);

            if (status === 200) {
              resolve(parsedResponse);
            } else {
              reject(parsedResponse);
            }
          } catch (error) {
            reject(error);
          }
        };

        this.currentFileUploadXhr.send(fileMeta.file);
      } catch (error) {
        reject(error);
      }
    });
  }

  createUploadFilesHeaders() {
    const { stripes: { okapi } } = this.props;

    return {
      ...createOkapiHeaders(okapi),
      'Content-Type': 'application/octet-stream',
    };
  }

  updateFileState(fileKey, data) {
    this.setState(state => {
      const updatedFile = {
        ...state.files[fileKey],
        ...data,
      };

      return {
        files: {
          ...state.files,
          [fileKey]: updatedFile,
        },
      };
    });
  }

  onFileUploadProgress = (fileKey, { loaded: uploadedValue }) => {
    this.updateFileState(fileKey, { uploadedValue });
  };

  handleFileUploadSuccess = (response, fileKey) => {
    const { uploadedDate } = response.fileDefinitions.find(fileDefinition => fileDefinition.uiKey === fileKey);

    this.updateFileState(fileKey, {
      status: FILE_STATUSES.UPLOADED,
      uploadedDate,
    });
  };

  handleFileUploadFail = fileKey => {
    this.updateFileState(fileKey, { status: FILE_STATUSES.ERROR });
  };

  handleDeleteFile = () => {
    const {
      key,
      status,
    } = get(this.state, ['files', this.selectedFile]);

    const deleteFile = this.fileRemovalMap[status];
    if (deleteFile) {
      deleteFile(key, status);
    }
  };

  deleteFileAPI = async (fileKey, fileStatus) => {
    const { files: { [fileKey]: fileMeta } } = this.state;
    const { history } = this.props;

    this.updateFileState(fileKey, { loading: true });

    try {
      await API.deleteFile(
        this.createFileUrl(fileMeta),
        this.createDeleteFileHeaders(),
      );

      await this.deleteFileFromState(fileKey);
    } catch (error) {
      this.updateFileState(fileKey, {
        status: fileStatus,
        loading: false,
      });

      const errorMessage = (
        <FormattedMessage
          id="ui-data-import.fileDeleteError"
          values={{ name: <strong>{fileMeta.name}</strong> }}
        />
      );

      this.calloutRef.current.sendCallout({
        type: 'error',
        message: errorMessage,
      });

      console.error(error); // eslint-disable-line no-console
    }

    this.setState({ renderCancelUploadFileModal: false });

    const lastFileDeleted = isEmpty(get(this.state, ['files'], {}));

    if (lastFileDeleted) {
      history.push({
        pathname: '/data-import',
        search: '',
      });
    }
  };

  createFileUrl = file => {
    const { stripes: { okapi } } = this.props;

    const { url: host } = okapi;

    return createUrl(`${host}/data-import/uploadDefinitions/${file.uploadDefinitionId}/files/${file.id}`);
  };

  createDeleteFileHeaders() {
    const { stripes: { okapi } } = this.props;

    return createOkapiHeaders(okapi);
  }

  deleteFileFromState = fileKey => new Promise(resolve => {
    this.setState(state => {
      const updatedFiles = omit(state.files, fileKey);

      return { files: updatedFiles };
    }, resolve);
  });

  renderFiles() {
    const { files } = this.state;

    if (isEmpty(files)) {
      return (
        <Layout
          data-test-empty-msg
          className="textCentered"
        >
          <FormattedMessage id="ui-data-import.noUploadedFiles" />
        </Layout>
      );
    }

    return map(files, (file, fileKey) => {
      const {
        status,
        name,
        size,
        uploadedValue,
        uploadedDate,
        loading,
        errorMsgTranslationID,
      } = file;

      return (
        <FileItem
          isSnapshotMode={this.isSnapshotMode}
          key={fileKey}
          uiKey={fileKey}
          status={status}
          name={name}
          size={size}
          loading={loading}
          uploadedValue={uploadedValue}
          errorMsgTranslationID={errorMsgTranslationID}
          uploadedDate={uploadedDate}
          onCancelImport={this.openCancelUploadModal}
          onDelete={this.handleDeleteFile}
        />
      );
    });
  }

  continue = () => {
    const { history } = this.props;
    const { nextLocation } = this.state;

    this.unblockNavigation();
    history.push(nextLocation.pathname);
  };

  closeModal = () => {
    this.setState({ renderLeaveModal: false });
  };

  openCancelUploadModal = fileKey => {
    this.setState({ renderCancelUploadFileModal: true });
    this.updateFileState(fileKey, { status: FILE_STATUSES.DELETING });
    this.selectedFile = fileKey;
  }

  closeCancelUploadModal = () => {
    this.updateFileState(this.selectedFile, { status: FILE_STATUSES.UPLOADED });
    this.setState({ renderCancelUploadFileModal: false });
  }

  /** @returns {Promise<string[]>} */
  async getDataTypes() {
    const { stripes: { okapi } } = this.props;
    const [firstFile] = Object.values(get(this.state, ['files'], {}));
    const fileExtension = getFileExtension(firstFile);

    const { url: host } = okapi;

    const response = await fetch(
      createUrl(`${host}/data-import/fileExtensions`, { query: `extension=="${fileExtension}"` }, false),
      { headers: { ...createOkapiHeaders(okapi) } },
    );

    const body = await response.json();

    return get(body, ['fileExtensions', 0, 'dataTypes'], []);
  }

  async updateJobProfilesComponent() {
    const dataTypes = await this.getDataTypes();
    const dataTypeQuery = dataTypes.length > 0
      ? `(${dataTypes.map(dataType => `"${dataType}"`).join(' OR ')})`
      : '';

    this.setState({ JobProfilesComponent: createJobProfiles(true, dataTypeQuery, true) });
  }

  renderHeader = headerProps => (
    <PaneHeader
      {...headerProps}
      paneTitle={<FormattedMessage id="ui-data-import.uploadingPaneTitle" />}
    />
  );

  render() {
    const {
      hasLoaded,
      renderLeaveModal,
      renderCancelUploadFileModal,
      JobProfilesComponent,
      actionMenuItems,
    } = this.state;

    if (!hasLoaded) {
      return (
        <Preloader
          message={<FormattedMessage id="ui-data-import.loading" />}
          size="medium"
          preloaderClassName={sharedCss.preloader}
        />
      );
    }

    const jobProfilesLabel = generateSettingsLabel('jobProfiles.title', 'jobProfiles');

    const leavePageMessage = (
      <FormattedMessage
        id="ui-data-import.modal.leavePage.message"
        values={{
          highlightedText: (
            <FormattedMessage
              tagName="strong"
              id="ui-data-import.modal.leavePage.messageHighlightedText"
            />
          ),
        }}
      />
    );

    return (
      <Paneset>
        <div
          className={css.uploadingJobs}
          data-test-uploading-jobs-display
        >
          <Pane
            id="pane-upload"
            defaultWidth="300px"
            renderHeader={this.renderHeader}
          >
            {this.renderFiles()}
            <EndOfItem />
            <Callout ref={this.calloutRef} />
            <ConfirmationModal
              id="leave-page-modal"
              open={renderLeaveModal}
              heading={<FormattedMessage id="ui-data-import.modal.leavePage.header" />}
              message={leavePageMessage}
              confirmLabel={<FormattedMessage id="ui-data-import.modal.leavePage.actionButton" />}
              cancelLabel={<FormattedMessage id="ui-data-import.modal.leavePage.cancel" />}
              onConfirm={this.closeModal}
              onCancel={this.continue}
            />
            <ConfirmationModal
              open={renderCancelUploadFileModal}
              heading={<FormattedMessage id="ui-data-import.modal.cancelUpload.header" />}
              message={<FormattedMessage id="ui-data-import.modal.cancelUpload.message" />}
              confirmLabel={<FormattedMessage id="ui-data-import.modal.cancelUpload.confirm" />}
              cancelLabel={<FormattedMessage id="ui-data-import.modal.cancelUpload.cancel" />}
              onConfirm={this.handleDeleteFile}
              onCancel={this.closeCancelUploadModal}
            />
          </Pane>
        </div>
        {JobProfilesComponent
          ? (
            <JobProfilesComponent
              label={jobProfilesLabel}
              actionMenuItems={null}
              withNewRecordButton={false}
              detailProps={{ actionMenuItems }}
            />
          )
          : (
            <Pane
              id="pane-loading"
              paneTitle={jobProfilesLabel}
              defaultWidth="fill"
            >
              <Preloader
                message={<FormattedMessage id="ui-data-import.loading" />}
                size="medium"
                preloaderClassName={sharedCss.preloader}
              />
            </Pane>
          )
        }
      </Paneset>
    );
  }
}
