import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  withRouter,
  Redirect,
} from 'react-router';
import {
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
  Preloader,
  createUrl,
  getFileExtension,
} from '@folio/stripes-data-transfer-components';

import { ReturnToAssignJobs } from './components';
import { UploadingJobsContext } from '../UploadingJobsContextProvider';
import * as API from '../../utils/upload';
import {
  checkForKnowErrorModalTypes,
  getErrorModalMeta,
  ERROR_MODAL_META_TYPES,
} from './components/getErrorModalMeta';
import { permissions } from '../../utils';

import sharedCss from '../../shared.css';

@withRouter
@withStripes
export class ImportJobs extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  };

  static contextType = UploadingJobsContext;

  state = {
    isDropZoneActive: false,
    filesExtensionsModalOpen: false,
    filesExtensionsModalType: null,
    redirect: false,
    hasLoaded: false,
    prohibitFilesUploading: false,
  };

  componentDidMount() {
    this.timerHandler = setTimeout(() => { this.fetchUploadDefinition(); }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timerHandler);
  }

  calloutRef = createRef();

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

  showCreateUploadDefinitionErrorMessage() {
    this.calloutRef.current.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-data-import.communicationProblem" />,
    });
  }

  showDeleteUploadDefinitionErrorMessage() {
    const errorMessage = (
      <FormattedMessage
        id="ui-data-import.fileDefinitionDeleteError"
        values={{
          button: (
            <FormattedMessage
              id="ui-data-import.returnToAssign.deleteFiles"
              tagName="strong"
            />
          ),
        }}
      />
    );

    this.calloutRef.current.sendCallout({
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
    const { stripes: { okapi } } = this.props;
    const { updateUploadDefinition } = this.context;

    const { url: host } = okapi;

    this.setState({ isDropZoneActive: false });

    try {
      const uploadDefinition = await updateUploadDefinition();

      if (!isEmpty(uploadDefinition)) {
        this.setState({ prohibitFilesUploading: true });

        return;
      }
    } catch (error) {
      return;
    }

    const haveFilesNoExtension = this.checkFilesHaveNoExtension(acceptedFiles);
    const haveFilesSameExtension = this.checkFilesHaveSameExtension(acceptedFiles);

    if (haveFilesNoExtension) {
      this.showFilesExtensionsModal({ type: ERROR_MODAL_META_TYPES.NO_EXTENSION });

      return;
    }

    if (!haveFilesSameExtension) {
      this.showFilesExtensionsModal({ type: ERROR_MODAL_META_TYPES.INCONSISTENT });

      return;
    }

    const files = API.mapFilesToUI(acceptedFiles);

    try {
      // post file upload definition with all files metadata as
      // individual file upload should have upload definition id in the URL
      const [errorMessage, response] = await API.createUploadDefinition({
        files,
        url: createUrl(`${host}/data-import/uploadDefinitions`),
        okapi,
      });

      if (!errorMessage) {
        const fileDefinitions = this.updateFilesWithFileDefinitionMetadata(files, response.fileDefinitions);

        this.redirectToJobProfilePage(fileDefinitions);
      }

      this.handleUploadDefinitionError(errorMessage);
    } catch (error) {
      this.showCreateUploadDefinitionErrorMessage();

      console.error(error); // eslint-disable-line no-console
    }
  };

  handleUploadDefinitionError(errorMessage) {
    const knownErrorModalType = checkForKnowErrorModalTypes(errorMessage);

    if (knownErrorModalType) {
      this.showFilesExtensionsModal({ type: knownErrorModalType });
    }
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

  checkFilesHaveSameExtension(files = []) {
    const fileExtensions = files.map(getFileExtension);
    const baseFileExtension = fileExtensions[0];

    return fileExtensions.every(fileExtension => fileExtension === baseFileExtension);
  }

  checkFilesHaveNoExtension(files = []) {
    const fileExtensions = files.map(getFileExtension);

    return fileExtensions.some(fileExtension => !fileExtension);
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

  renderImportJobs() {
    const { match: { path }, stripes } = this.props;
    const { filesExtensionsModalType } = this.state;
    const { uploadDefinition } = this.context;

    const {
      files,
      redirect,
      hasLoaded,
      isDropZoneActive,
      prohibitFilesUploading,
      filesExtensionsModalOpen,
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

    return (
      <FileUploader
        title={titleText}
        uploadButtonText={uploadButtonText}
        isDropZoneActive={isDropZoneActive}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        disabled={!stripes.hasPerm(permissions.DATA_IMPORT_MANAGE)}
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
      <>
        {this.renderImportJobs()}
        <Callout ref={this.calloutRef} />
      </>
    );
  }
}
