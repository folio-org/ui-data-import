import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  withRouter,
  Redirect,
} from 'react-router';
import {
  map,
  every,
  forEach,
  isEmpty,
} from 'lodash';

import {
  ConfirmationModal,
  Callout,
} from '@folio/stripes/components';
import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import {
  FileUploader,
  ReturnToAssignJobs,
} from './components';
import { Preloader } from '../Preloader';

import { UploadingJobsContext } from '../UploadingJobsContextProvider';
import {
  createOkapiHeaders,
  createUrl,
} from '../../utils';
import * as API from '../UploadingJobsDisplay/utils/upload';
import {
  checkForKnowErrorModalTypes,
  getErrorModalMeta,
  ERROR_MODAL_META_TYPES,
} from './components/getErrorModalMeta';

import css from './components/FileUploader/FileUploader.css';

@withRouter
@withStripes
export class ImportJobs extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  static contextType = UploadingJobsContext;

  constructor(props) {
    super(props);

    const { stripes: { okapi } } = this.props;

    const { url: host } = okapi;

    this.uploadDefinitionUrl = createUrl(`${host}/data-import/uploadDefinitions`);

    this.state = {
      isDropZoneActive: false,
      filesExtensionsModalOpen: false,
      filesExtensionsModalType: null,
      redirect: false,
      hasLoaded: false,
      prohibitFilesUploading: false,
      showErrorMessage: false,
    };
  }

  componentDidMount() {
    this.fetchUploadDefinition();
  }

  async fetchUploadDefinition() {
    try {
      const { updateUploadDefinition } = this.context;

      const uploadDefinition = await updateUploadDefinition();

      await this.deleteUploadDefinitionWithoutFiles(uploadDefinition);

      this.setState({ hasLoaded: true });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }

  async deleteUploadDefinitionWithoutFiles(uploadDefinition) {
    const { deleteUploadDefinition } = this.context;

    const hasUploadDefinition = !isEmpty(uploadDefinition);

    if (hasUploadDefinition) {
      const hasUploadDefinitionFiles = !isEmpty(uploadDefinition.fileDefinitions);

      if (!hasUploadDefinitionFiles) {
        try {
          await deleteUploadDefinition();
        } catch (error) {
          this.showDeleteUploadDefinitionErrorMessage();

          console.error(error); // eslint-disable-line no-console
        }
      }
    }
  }

  showDeleteUploadDefinitionErrorMessage() {
    const errorMessage = (
      <FormattedMessage
        id="ui-data-import.fileDefinitionDeleteError"
        values={{
          button: (
            <strong>
              <FormattedMessage id="ui-data-import.returnToAssign.deleteFiles" />
            </strong>
          ),
        }}
      />
    );

    this.callout.sendCallout({
      type: 'error',
      message: errorMessage,
    });
  }

  onDragEnter = () => {
    this.setState({ isDropZoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ isDropZoneActive: false });
  };

  onDrop = async acceptedFiles => {
    const { updateUploadDefinition } = this.context;

    this.setState({
      isDropZoneActive: false,
      showErrorMessage: false,
    });

    try {
      const uploadDefinition = await updateUploadDefinition();

      if (!isEmpty(uploadDefinition)) {
        this.setState({ prohibitFilesUploading: true });

        return;
      }
    } catch (error) {
      this.setState({ showErrorMessage: true });

      return;
    }

    const haveFilesSameExtension = this.checkFilesHaveSameExtension(acceptedFiles);

    if (!haveFilesSameExtension) {
      this.showFilesExtensionsModal({ type: ERROR_MODAL_META_TYPES.INCONSISTENT });

      return;
    }

    const files = API.mapFilesToUI(acceptedFiles);

    // post file upload definition with all files metadata as
    // individual file upload should have upload definition id in the URL
    const [errorMessage, response] = await API.createUploadDefinition(
      files,
      this.uploadDefinitionUrl,
      this.createFilesDefinitionHeaders(),
    );

    if (!errorMessage) {
      const fileDefinitions = this.updateFilesWithFileDefinitionMetadata(files, response.fileDefinitions);

      this.redirectToJobProfilePage(fileDefinitions);
    }

    this.handleUploadDefinitionError(errorMessage);
  };

  handleUploadDefinitionError(errorMessage) {
    const knownErrorModalType = checkForKnowErrorModalTypes(errorMessage);

    if (knownErrorModalType) {
      this.showFilesExtensionsModal({ type: knownErrorModalType });

      return;
    }

    this.setState({ showErrorMessage: true });

    console.error(errorMessage); // eslint-disable-line no-console
  }

  updateFilesWithFileDefinitionMetadata(files, fileDefinitions) {
    const updatedFiles = { ...files };

    forEach(fileDefinitions, definition => {
      const {
        uiKey,
        id,
        uploadDefinitionId,
      } = definition;

      updatedFiles[uiKey] = {
        ...updatedFiles[uiKey],
        id,
        uploadDefinitionId,
      };
    });

    return updatedFiles;
  }

  createFilesDefinitionHeaders() {
    const { stripes: { okapi } } = this.props;

    return {
      ...createOkapiHeaders(okapi),
      'Content-Type': 'application/json',
    };
  }

  checkFilesHaveSameExtension(files = []) {
    const fileTypeRegex = /\.(\w+)$/;
    const filesTypes = map(files, ({ name }) => (name.match(fileTypeRegex) || [])[1]);
    const baseFileType = filesTypes[0];

    return every(filesTypes, type => type === baseFileType);
  }

  showFilesExtensionsModal(payload) {
    this.setState({
      filesExtensionsModalOpen: true,
      filesExtensionsModalType: payload.type,
    });
  }

  hideFilesExtensionsModal = () => {
    this.setState({
      filesExtensionsModalOpen: false,
      filesExtensionsModalType: null,
    });
  };

  getMessageById(idEnding, moduleName = 'ui-data-import') {
    const id = `${moduleName}.${idEnding}`;

    return <FormattedMessage id={id} />;
  }

  redirectToJobProfilePage = files => {
    this.setState({
      redirect: true,
      files,
    });
  };

  createCalloutRef = ref => { this.callout = ref; };

  renderImportJobs() {
    const { match: { path } } = this.props;
    const { filesExtensionsModalType } = this.state;
    const { uploadDefinition } = this.context;

    const {
      files,
      redirect,
      hasLoaded,
      showErrorMessage,
      isDropZoneActive,
      prohibitFilesUploading,
      filesExtensionsModalOpen,
    } = this.state;

    if (!hasLoaded) {
      return <Preloader />;
    }

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: `${path}/job-profile`,
            state: { files },
          }}
        />
      );
    }

    if (!isEmpty(uploadDefinition)) {
      return (
        <ReturnToAssignJobs
          prohibitFilesUploading={prohibitFilesUploading}
          onResume={() => this.redirectToJobProfilePage()}
        />
      );
    }

    const titleMessageIdEnding = isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const modalMeta = getErrorModalMeta(filesExtensionsModalType);
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadButtonText = this.getMessageById('uploadBtnText');
    const errorMessage = showErrorMessage && this.getMessageById('importJobs.errorMessage');

    return (
      <FileUploader
        title={titleText}
        uploadButtonText={uploadButtonText}
        errorMessage={errorMessage}
        isDropZoneActive={isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {openDialogWindow => (
          <ConfirmationModal
            id="file-extensions-modal"
            open={filesExtensionsModalOpen}
            heading={<span data-test-file-extensions-modal-header>{modalMeta.heading}</span>}
            message={modalMeta.message}
            confirmLabel={<FormattedMessage id="ui-data-import.modal.fileExtensions.actionButton" />}
            cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
            onConfirm={() => {
              this.hideFilesExtensionsModal();
              openDialogWindow();
            }}
            onCancel={this.hideFilesExtensionsModal}
          />
        )}
      </FileUploader>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderImportJobs()}
        <Callout ref={this.createCalloutRef} />
      </Fragment>
    );
  }
}
