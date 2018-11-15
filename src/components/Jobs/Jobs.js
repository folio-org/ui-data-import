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
    return (
      <div className={css.jobsPane}>
        <AccordionSet>
          <Accordion
            label={<FormattedMessage id="ui-data-import.previewJobs" />}
            separator={false}
          >
            <PreviewsJobs
              checkDateIsToday={this.checkDateIsToday}
              noJobsMessage={<FormattedMessage id="ui-data-import.noPreviewsJobsMessage" />}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-data-import.runningJobs" />}
            separator={false}
          >
            {/* TODO: UIDATIMP-27 story */}
            <JobsList
              jobs={jobsMocks.running}
              checkDateIsToday={this.checkDateIsToday}
              hasLoaded
              noJobsMessage={<FormattedMessage id="ui-data-import.noRunningJobsMessage" />}
            />
          </Accordion>
        </AccordionSet>
      </div>
    );
  }
}

export default injectIntl(Jobs);
