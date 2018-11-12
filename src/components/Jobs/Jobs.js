import React, { Component } from 'react';
import {
  intlShape,
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import {
  AccordionSet,
  Accordion,
} from '@folio/stripes/components';

import PreviewsJobs from './components/PreviewsJobs';
import JobsList from './components/JobsList';
import jobsMocks from './jobsMocks';

import css from './Jobs.css';

class Jobs extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  checkDateIsToday = date => {
    const { formatDate } = this.props.intl;

    return formatDate(new Date()) === formatDate(date);
  };

  render() {
    // const { formatMessage } = this.props.intl;
    // const previewsLabelText = formatMessage({ id: 'ui-data-import.previewJobs' });
    const previewsLabelText = (
      <FormattedMessage
        id="ui-data-import.previewJobs"
      />
    );
    // const runningLabelText = formatMessage({ id: 'ui-data-import.runningJobs' });
    const runningLabelText = (
      <FormattedMessage
        id="ui-data-import.runningJobs"
      />
    );
    // const noPreviewsJobsMessage = formatMessage({ id: 'ui-data-import.noPreviewsJobsMessage' });
    const noPreviewsJobsMessage = (
      <FormattedMessage
        id="ui-data-import.noPreviewsJobsMessage"
      />
    );
    // const noRunningJobsMessage = formatMessage({ id: 'ui-data-import.noRunningJobsMessage' });
    const noRunningJobsMessage = (
      <FormattedMessage
        id="ui-data-import.noRunningJobsMessage"
      />
    );

    return (
      <div className={css.jobsPane}>
        <AccordionSet>
          <Accordion
            label={previewsLabelText}
            separator={false}
          >
            <PreviewsJobs
              checkDateIsToday={this.checkDateIsToday}
              noJobsMessage={noPreviewsJobsMessage}
            />
          </Accordion>
          <Accordion
            label={runningLabelText}
            separator={false}
          >
            {/* TODO: UIDATIMP-27 story */}
            <JobsList
              jobs={jobsMocks.running}
              checkDateIsToday={this.checkDateIsToday}
              hasLoaded
              noJobsMessage={noRunningJobsMessage}
            />
          </Accordion>
        </AccordionSet>
      </div>
    );
  }
}

export default injectIntl(Jobs);
