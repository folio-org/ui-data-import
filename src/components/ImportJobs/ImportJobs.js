import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
    isModalOpen: false,
    redirect: false,
    hasLoaded: false,
  };

  componentDidMount() {
    this.updateUploadDefinition();
  }

  async updateUploadDefinition() {
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
    this.setState({ isDropZoneActive: false });

    const { setFiles } = this.context;
    const isValidFileExtensions = this.validateFileExtensions(acceptedFiles);

    if (isValidFileExtensions) {
      setFiles(acceptedFiles);

      this.setState({
        isDropZoneActive: false,
        redirect: true,
      });

      return;
    }

    this.showModal();
  };

  validateFileExtensions(files = []) {
    const fileTypeRegex = /\.(\w+)$/;
    const filesTypes = files.map(({ name }) => (name.match(fileTypeRegex) || [])[1]);
    const baseFileType = filesTypes[0];

    return filesTypes.every(type => type === baseFileType);
  }

  showModal() {
    this.setState({ isModalOpen: true });
  }

  hideModal = () => {
    this.setState({ isModalOpen: false });
  };

  getMessageById(idEnding, moduleName = 'ui-data-import') {
    const id = `${moduleName}.${idEnding}`;

    return <FormattedMessage id={id} />;
  }

  render() {
    const { match: { path } } = this.props;
    const {
      redirect,
      isDropZoneActive,
      isModalOpen,
      hasLoaded,
    } = this.state;
    const { uploadDefinition } = this.context;

    if (!hasLoaded) {
      return <Preloader />;
    }

    if (redirect) {
      return <Redirect to={`${path}/job-profile`} />;
    }

    if (uploadDefinition) {
      return <ReturnToAssignJobs />;
    }

    const titleMessageIdEnding = isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadBtnText = this.getMessageById('uploadBtnText');

    return (
      <FileUploader
        title={titleText}
        uploadBtnText={uploadBtnText}
        isDropZoneActive={isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {openFileUploadDialogWindow => (
          <InvalidFilesModal
            isModalOpen={isModalOpen}
            onConfirmModal={this.hideModal}
            openFileUploadDialogWindow={openFileUploadDialogWindow}
          />
        )}
      </FileUploader>
    );
  }
}

export default withRouter(ImportJobs);
