import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  Pane,
} from '@folio/stripes/components';

import { UploadingJobsDisplay } from '../components';
import { isTestEnv } from '../utils';

const timeoutBeforeFileDeletion = isTestEnv() ? 500 : 10000;

export class JobProfile extends Component {
  render() {
    return (
      <Paneset>
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-data-import.uploadingPaneTitle" />}
        >
          <UploadingJobsDisplay timeoutBeforeFileDeletion={timeoutBeforeFileDeletion} />
        </Pane>
      </Paneset>
    );
  }
}
