import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import { Preloader } from '../components/Preloader';

@stripesConnect
export class ViewJobLog extends Component {
  static manifest = Object.freeze({
    jobLog: {
      type: 'okapi',
      // TODO: should be changed to URL with real snapshotId after completion of UIDATIMP-186
      // path: 'source-storage/sourceRecords?query=snapshotId=:{id}&limit=1000',
      path: 'source-storage/sourceRecords?query=snapshotId=00000000-0000-0000-0000-000000000000&limit=1000',
      throwsErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      jobLog: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired
        ).isRequired,
      }),
    }),
  };

  componentDidMount() {
    document.querySelector('header').setAttribute('style', 'display: none');
  }

  get jobLogData() {
    const { resources } = this.props;

    const jobLog = resources.jobLog || {};
    const [record] = jobLog.records || [];

    return {
      hasLoaded: jobLog.hasLoaded,
      record,
    };
  }

  formatSourceRecords = sourceRecords => JSON.stringify(sourceRecords, null, 2);

  render() {
    const {
      hasLoaded,
      record,
    } = this.jobLogData;
    const renderSpinner = !record || !hasLoaded;

    if (renderSpinner) {
      return (
        <Preloader />
      );
    }

    const {
      sourceRecords,
      totalRecords,
    } = record;

    return (
      <div id="view-job-log-test">
        <div id="view-total-records-test">
          <FormattedMessage id="ui-data-import.totalRecords" />: {totalRecords}
        </div>
        <pre id="job-log-json">
          {this.formatSourceRecords(sourceRecords)}
        </pre>
      </div>
    );
  }
}
