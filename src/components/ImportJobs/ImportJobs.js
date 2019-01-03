import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FileUploader from './components/FileUploader';
import InvalidFilesModal from './components/InvalidFilesModal';

import css from './components/FileUploader/FileUploader.css';

class ImportJobs extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    isDropZoneActive: false,
    isModalOpen: false,
    redirect: false,
  };

  onDragEnter = () => {
    this.setState({ isDropZoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ isDropZoneActive: false });
  };

  /**
   * @param  {Array<File>} acceptedFiles
   * @param  {Array<File>} rejectedFiles
   */
  onDrop = (acceptedFiles, rejectedFiles) => {
    const isValidFileExtensions = this.validateFileExtensions(acceptedFiles);

    if (isValidFileExtensions) {
      this.setState({
        isDropZoneActive: false,
        redirect: true,
        acceptedFiles,
        rejectedFiles,
      });

      return;
    }

    this.setState({ isDropZoneActive: false });
    this.showModal();
  };

  /**
   * @param  {Array<File>} files
   */
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
    const {
      acceptedFiles,
      rejectedFiles,
      redirect,
      isDropZoneActive,
      isModalOpen,
    } = this.state;
    const { match } = this.props;
    const titleMessageIdEnding = isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadBtnText = this.getMessageById('uploadBtnText');

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: `${match.path}/job-profile`,
            state: {
              acceptedFiles,
              rejectedFiles,
            },
          }}
        />
      );
    }

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
