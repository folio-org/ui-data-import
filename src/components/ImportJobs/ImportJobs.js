import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FileUpload from './components/FileUpload';

import css from './components/FileUpload/FileUpload.css';

class ImportJobs extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }),
  };

  state = {
    isDropZoneActive: false,
    toRedirect: false,
  };

  onDragEnter = () => {
    this.setState({
      isDropZoneActive: true,
    });
  };

  onDragLeave = () => {
    this.setState({
      isDropZoneActive: false,
    });
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({
      isDropZoneActive: false,
      acceptedFiles,
      rejectedFiles,
      toRedirect: true,
    });
  };

  getMessageById = (idEnding, moduleName = 'ui-data-import') => {
    const id = `${moduleName}.${idEnding}`;

    return <FormattedMessage id={id} />;
  };

  render() {
    const { acceptedFiles, rejectedFiles, toRedirect } = this.state;
    const { match } = this.props;
    const titleMessageIdEnding = this.state.isDropZoneActive ? 'activeUploadTitle' : 'uploadTitle';
    const titleText = this.getMessageById(titleMessageIdEnding);
    const uploadBtnText = this.getMessageById('uploadBtnText');

    if (toRedirect) {
      return (
        <Redirect to={{
          pathname: `${match.path}/job-profile`,
          state: { acceptedFiles, rejectedFiles },
        }}
        />
      );
    }

    return (
      <FileUpload
        title={titleText}
        uploadBtnText={uploadBtnText}
        isDropZoneActive={this.state.isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      />
    );
  }
}

export default withRouter(ImportJobs);
