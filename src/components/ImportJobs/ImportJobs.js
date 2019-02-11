import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import FileUploader from './components/FileUploader';
import InvalidFilesModal from './components/InvalidFilesModal';
import ReturnToAssignJobs from './components/ReturnToAssignJobs';
import Preloader from '../Preloader';
import { UploadingJobsContext } from '../UploadingJobsContextProvider';

import css from './components/FileUploader/FileUploader.css';

class ImportJobs extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  static contextType = UploadingJobsContext;

  state = {
    isDropZoneActive: false,
    filesExtensionsModalOpen: false,
    redirect: false,
    hasLoaded: false,
    prohibitFilesUploading: false,
    showErrorMessage: false,
  };

  componentDidMount() {
    this.fetchUploadDefinition();
  }

  async fetchUploadDefinition() {
    try {
      const { updateUploadDefinition } = this.context;

      await updateUploadDefinition();

      this.setState({ hasLoaded: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  onDragEnter = () => {
    this.setState({ isDropZoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ isDropZoneActive: false });
  };

  onDrop = async acceptedFiles => {
    const {
      setFiles,
      updateUploadDefinition,
    } = this.context;

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

    const isValidFileExtensions = this.validateFileExtensions(acceptedFiles);

    if (isValidFileExtensions) {
      setFiles(acceptedFiles);

      this.setState({ redirect: true });

      return;
    }

    this.showFilesExtensionsModal();
  };

  validateFileExtensions(files = []) {
    const fileTypeRegex = /\.(\w+)$/;
    const filesTypes = files.map(({ name }) => (name.match(fileTypeRegex) || [])[1]);
    const baseFileType = filesTypes[0];

    return filesTypes.every(type => type === baseFileType);
  }

  showFilesExtensionsModal() {
    this.setState({ filesExtensionsModalOpen: true });
  }

  hideFilesExtensionsModal = () => {
    this.setState({ filesExtensionsModalOpen: false });
  };

  getMessageById(idEnding, moduleName = 'ui-data-import') {
    const id = `${moduleName}.${idEnding}`;

    return <FormattedMessage id={id} />;
  }

  render() {
    const { match: { path } } = this.props;
    const { uploadDefinition } = this.context;
    const {
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
      return <Redirect to={`${path}/job-profile`} />;
    }

    if (!isEmpty(uploadDefinition)) {
      return <ReturnToAssignJobs prohibitFilesUploading={prohibitFilesUploading} />;
    }

    const titleMessageIdEnding = isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadBtnText = this.getMessageById('uploadBtnText');
    const errorMessage = showErrorMessage && this.getMessageById('importJobs.errorMessage');

    return (
      <FileUploader
        title={titleText}
        uploadBtnText={uploadBtnText}
        errorMessage={errorMessage}
        isDropZoneActive={isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {openDialogWindow => (
          <InvalidFilesModal
            open={filesExtensionsModalOpen}
            onConfirm={openDialogWindow}
            onCancel={this.hideFilesExtensionsModal}
          />
        )}
      </FileUploader>
    );
  }
}

export default withRouter(ImportJobs);
