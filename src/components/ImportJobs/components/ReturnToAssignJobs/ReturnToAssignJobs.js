import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { UPLOADED } from '../../../UploadingJobsDisplay/components/FileItem/fileItemStatuses';
import { UploadingJobsContext } from '../../../UploadingJobsContextProvider';

import css from './ReturnToAssignJobs.css';

export class ReturnToAssignJobs extends Component {
  static propTypes = { prohibitFilesUploading: PropTypes.bool };

  static defaultProps = { prohibitFilesUploading: false };

  static contextType = UploadingJobsContext;

  getIntlId(id) {
    return `ui-data-import.returnToAssign.${id}`;
  }

  get filesAmount() {
    const { uploadDefinition: { fileDefinitions = [] } } = this.context;

    return fileDefinitions.reduce((res, { status }) => {
      return status === UPLOADED ? res + 1 : res;
    }, 0);
  }

  render() {
    const { deleteUploadDefinition } = this.context;
    const { prohibitFilesUploading } = this.props;

    const messageId = prohibitFilesUploading ? 'messageWhenProhibited' : 'message';

    return (
      <div className={css.container}>
        <span className={css.message}>
          <FormattedMessage id={this.getIntlId(messageId)} />
        </span>
        <span className={css.subMessage}>
          <FormattedMessage
            id={this.getIntlId('subMessage')}
            values={{ filesAmount: this.filesAmount }}
          />
        </span>
        <div className={css.buttonsContainer}>
          <Button
            buttonStyle="primary"
            buttonClass={css.button}
          >
            <FormattedMessage id={this.getIntlId('resume')} />
          </Button>
          <Button
            buttonClass={css.button}
            onClick={deleteUploadDefinition}
          >
            <FormattedMessage id={this.getIntlId('deleteFiles')} />
          </Button>
        </div>
      </div>
    );
  }
}
