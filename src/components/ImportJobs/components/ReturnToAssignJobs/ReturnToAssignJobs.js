import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { UploadingJobsContext } from '../../../UploadingJobsContextProvider';

import css from './ReturnToAssignJobs.css';

class ReturnToAssignJobs extends Component {
  static contextType = UploadingJobsContext;

  getIntlId(id) {
    return `ui-data-import.returnToAssign.${id}`;
  }

  get filesAmount() {
    const { uploadDefinition: { fileDefinitions } } = this.context;

    return fileDefinitions.reduce((res, { loaded }) => {
      return loaded ? res + 1 : res;
    }, 0);
  }

  render() {
    const { deleteUploadDefinition } = this.context;

    return (
      <div className={css.container}>
        <span className={css.message}>
          <FormattedMessage id={this.getIntlId('message')} />
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

export default ReturnToAssignJobs;
