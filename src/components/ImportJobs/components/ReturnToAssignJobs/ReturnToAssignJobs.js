import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { UploadingJobsContext } from '../../../UploadingJobsContextProvider';
import { FILE_STATUSES } from '../../../../utils';

import css from './ReturnToAssignJobs.css';

export class ReturnToAssignJobs extends Component {
  static propTypes = {
    onResume: PropTypes.func.isRequired,
    prohibitFilesUploading: PropTypes.bool,
  };

  static contextType = UploadingJobsContext;

  state = { deletingInProgress: false };

  getIntlId(id) {
    return `ui-data-import.returnToAssign.${id}`;
  }

  get filesAmount() {
    const { uploadDefinition: { fileDefinitions = [] } } = this.context;

    return fileDefinitions.reduce((res, { status }) => {
      return status === FILE_STATUSES.UPLOADED ? res + 1 : res;
    }, 0);
  }

  onResume = () => {
    const { onResume } = this.props;
    const { deletingInProgress } = this.state;

    if (!deletingInProgress) {
      onResume();
    }
  };

  onDelete = async () => {
    const { deleteUploadDefinition } = this.context;
    const { deletingInProgress } = this.state;

    if (deletingInProgress) {
      return;
    }

    this.setState({ deletingInProgress: true });

    try {
      await deleteUploadDefinition();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }

    this.setState({ deletingInProgress: false });
  };

  render() {
    const { prohibitFilesUploading = false } = this.props;
    const { deletingInProgress } = this.state;

    const messageId = prohibitFilesUploading ? 'messageWhenProhibited' : 'message';

    return (
      <div
        className={css.container}
        data-test-return-to-assign-jobs
      >
        <span
          className={css.message}
          data-test-title
        >
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
            buttonClass={css.submitButton}
            onClick={this.onResume}
          >
            <FormattedMessage id={this.getIntlId('resume')} />
          </Button>
          <Button
            buttonClass={css.deleteButton}
            onClick={this.onDelete}
          >
            {deletingInProgress
              ? <Preloader size="medium" />
              : <FormattedMessage id={this.getIntlId('deleteFiles')} />
            }
          </Button>
        </div>
      </div>
    );
  }
}
