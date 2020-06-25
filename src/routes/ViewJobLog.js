import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import { Preloader } from '../components/Preloader';
import { LogViewer } from '../components/LogViewer';
import { LANGUAGES } from '../components/CodeHighlight/Languages';
import { THEMES } from '../components/CodeHighlight/Themes';

import css from '../components/LogViewer/LogViewer.css';

@stripesConnect
export class ViewJobLog extends Component {
  static manifest = Object.freeze({
    jobLog: {
      type: 'okapi',
      path: 'source-storage/records?snapshotId=:{id}&orderBy=order&limit=1000',
      throwsErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      jobLog: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
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

  render() {
    const {
      hasLoaded,
      record,
    } = this.jobLogData;

    if (!record || !hasLoaded) {
      return <Preloader />;
    }

    const { records } = record;

    // @TODO: Make Location object retrieval from props
    const jobId = document.location.href.split('/').slice(-1)[0];

    const toolbar = {
      visible: true,
      message: (
        <span>
          <FormattedMessage
            id="ui-data-import.import-log"
            tagName="strong"
          />
          <strong>&#123;</strong>
          <span className={css.recordId}>{jobId}</span>
          <strong>&#125;</strong>:
        </span>
      ),
      showThemes: true,
    };

    return (
      <div id="job-log-colorizer">
        <LogViewer
          code={records}
          language={LANGUAGES.JSON}
          theme={THEMES.COY}
          toolbar={toolbar}
          errorDetector={entry => !!entry.errorRecord}
        />
      </div>
    );
  }
}
